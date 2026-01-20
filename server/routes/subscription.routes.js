/**
 * Rutas de Suscripciones - Stripe
 * Vértice Gastronómico
 */

import express from 'express';
import Stripe from 'stripe';
import stripeService from '../services/stripe.service.js';
import { requireAuth, requireSubscription } from '../middleware/auth.middleware.js';
import { logger, paymentLogger } from '../services/monitoring.service.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

/**
 * GET /api/subscriptions/plans
 * Obtener planes disponibles
 */
router.get('/plans', (req, res) => {
  const plans = stripeService.getAvailablePlans();

  res.json({
    success: true,
    data: plans
  });
});

/**
 * GET /api/subscriptions/status
 * Obtener estado de suscripción actual
 */
router.get('/status', requireAuth, async (req, res) => {
  try {
    const status = await stripeService.getSubscriptionStatus(req.user.id);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error obteniendo estado de suscripción');
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

/**
 * POST /api/subscriptions/checkout
 * Crear sesión de checkout de Stripe
 */
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({
        error: 'Plan inválido',
        message: 'Selecciona un plan válido'
      });
    }

    const successUrl = `${process.env.APP_URL || 'http://localhost:5173'}/dashboard/subscription?success=true`;
    const cancelUrl = `${process.env.APP_URL || 'http://localhost:5173'}/pricing?cancelled=true`;

    const session = await stripeService.createCheckoutSession(
      req.user.id,
      plan,
      successUrl,
      cancelUrl
    );

    paymentLogger.info({
      userId: req.user.id,
      plan,
      sessionId: session.id
    }, 'Checkout session creada');

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    paymentLogger.error({ error: error.message }, 'Error creando checkout');
    res.status(500).json({
      error: 'Error',
      message: error.message
    });
  }
});

/**
 * POST /api/subscriptions/portal
 * Crear sesión del portal de facturación
 */
router.post('/portal', requireAuth, async (req, res) => {
  try {
    const returnUrl = `${process.env.APP_URL || 'http://localhost:5173'}/dashboard/subscription`;

    const session = await stripeService.createBillingPortalSession(
      req.user.id,
      returnUrl
    );

    res.json({
      success: true,
      data: {
        url: session.url
      }
    });
  } catch (error) {
    paymentLogger.error({ error: error.message }, 'Error creando portal session');
    res.status(400).json({
      error: 'Error',
      message: error.message
    });
  }
});

/**
 * POST /api/subscriptions/cancel
 * Cancelar suscripción
 */
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    const { immediately = false } = req.body;

    const result = await stripeService.cancelSubscription(req.user.id, immediately);

    paymentLogger.info({
      userId: req.user.id,
      immediately
    }, 'Suscripción cancelada');

    res.json({
      success: true,
      message: immediately
        ? 'Suscripción cancelada inmediatamente'
        : 'Tu suscripción se cancelará al final del período actual',
      data: result
    });
  } catch (error) {
    paymentLogger.error({ error: error.message }, 'Error cancelando suscripción');
    res.status(400).json({
      error: 'Error',
      message: error.message
    });
  }
});

/**
 * POST /api/subscriptions/webhook
 * Webhook de Stripe
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Desarrollo sin firma
      event = JSON.parse(req.body.toString());
    }
  } catch (error) {
    paymentLogger.error({ error: error.message }, 'Webhook signature verification failed');
    return res.status(400).json({ error: 'Webhook Error' });
  }

  paymentLogger.info({ type: event.type }, 'Webhook recibido');

  try {
    await stripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    paymentLogger.error({ error: error.message, type: event.type }, 'Error procesando webhook');
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

/**
 * GET /api/subscriptions/invoices
 * Obtener historial de facturas
 */
router.get('/invoices', requireAuth, async (req, res) => {
  try {
    const { prisma } = await import('../config/database.js');

    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user.id }
    });

    if (!subscription?.stripeCustomerId) {
      return res.json({
        success: true,
        data: []
      });
    }

    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 12
    });

    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      date: new Date(invoice.created * 1000),
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status,
      pdfUrl: invoice.invoice_pdf,
      hostedUrl: invoice.hosted_invoice_url
    }));

    res.json({
      success: true,
      data: formattedInvoices
    });
  } catch (error) {
    paymentLogger.error({ error: error.message }, 'Error obteniendo facturas');
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

/**
 * GET /api/subscriptions/usage
 * Obtener uso del plan actual
 */
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const { cache } = await import('../config/redis.js');

    // Obtener uso del mes actual
    const userId = req.user.id;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const [queries, reports, agents] = await Promise.all([
      cache.get(`usage:${userId}:queries:${currentMonth}`) || 0,
      cache.get(`usage:${userId}:reports:${currentMonth}`) || 0,
      cache.get(`usage:${userId}:agents`) || 0
    ]);

    // Obtener límites del plan
    const status = await stripeService.getSubscriptionStatus(userId);

    const limits = {
      FREE: { queries: 100, reports: 0, agents: 3 },
      STARTER: { queries: 1000, reports: 10, agents: 20 },
      PROFESSIONAL: { queries: 10000, reports: 100, agents: 50 },
      ENTERPRISE: { queries: Infinity, reports: Infinity, agents: 72 }
    };

    const planLimits = limits[status.plan] || limits.FREE;

    res.json({
      success: true,
      data: {
        plan: status.plan,
        usage: {
          queries: { current: queries, limit: planLimits.queries },
          reports: { current: reports, limit: planLimits.reports },
          agents: { current: agents, limit: planLimits.agents }
        },
        billingPeriod: {
          start: new Date(new Date().setDate(1)),
          end: status.currentPeriodEnd || new Date(new Date().setMonth(new Date().getMonth() + 1, 0))
        }
      }
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error obteniendo uso');
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

export default router;
