/**
 * Servicio de Pagos - Stripe
 * Vértice Gastronómico
 */

import Stripe from 'stripe';
import { prisma } from '../config/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Planes de suscripción
const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Gratuito',
    priceId: null,
    price: 0,
    currency: 'mxn',
    features: ['1 restaurante', '3 agentes', '100 consultas/mes', 'Soporte básico']
  },
  STARTER: {
    name: 'Inicial',
    priceId: process.env.STRIPE_PRICE_STARTER,
    price: 499,
    currency: 'mxn',
    features: ['3 restaurantes', '20 agentes', '1,000 consultas/mes', 'Reportes básicos', 'Soporte email']
  },
  PROFESSIONAL: {
    name: 'Profesional',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL,
    price: 1499,
    currency: 'mxn',
    features: ['10 restaurantes', '50 agentes', '10,000 consultas/mes', 'Reportes avanzados', 'API access', 'Soporte prioritario']
  },
  ENTERPRISE: {
    name: 'Empresarial',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    price: 4999,
    currency: 'mxn',
    features: ['Restaurantes ilimitados', '72 agentes', 'Consultas ilimitadas', 'White-label', 'SLA 99.9%', 'Soporte dedicado']
  }
};

// Crear o obtener cliente de Stripe
export async function getOrCreateCustomer(user) {
  // Buscar suscripción existente
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id }
  });

  if (subscription?.stripeCustomerId) {
    return stripe.customers.retrieve(subscription.stripeCustomerId);
  }

  // Crear nuevo cliente
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id
    }
  });

  return customer;
}

// Crear sesión de checkout
export async function createCheckoutSession(userId, planKey, successUrl, cancelUrl) {
  const plan = SUBSCRIPTION_PLANS[planKey];
  if (!plan || !plan.priceId) {
    throw new Error('Plan no válido o gratuito');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const customer = await getOrCreateCustomer(user);

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: user.id,
      plan: planKey
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        plan: planKey
      }
    }
  });

  return session;
}

// Crear portal de facturación
export async function createBillingPortalSession(userId, returnUrl) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId }
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error('No hay suscripción activa');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl
  });

  return session;
}

// Procesar webhook de Stripe
export async function handleWebhook(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionCancelled(subscription);
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      await handleInvoicePaid(invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }
  }
}

// Manejar checkout completado
async function handleCheckoutComplete(session) {
  const { userId, plan } = session.metadata;

  if (!userId) return;

  const subscriptionId = session.subscription;
  const customerId = session.customer;

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: 'ACTIVE',
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    },
    create: {
      userId,
      plan,
      status: 'ACTIVE',
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    }
  });

  // Log de auditoría
  await prisma.auditLog.create({
    data: {
      action: 'SUBSCRIPTION_CREATED',
      entity: 'Subscription',
      entityId: subscriptionId,
      userId,
      metadata: { plan, customerId }
    }
  });
}

// Manejar actualización de suscripción
async function handleSubscriptionUpdate(stripeSubscription) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSubscription.id }
  });

  if (!subscription) return;

  const status = stripeSubscription.status === 'active' ? 'ACTIVE'
    : stripeSubscription.status === 'past_due' ? 'PAST_DUE'
    : stripeSubscription.status === 'canceled' ? 'CANCELLED'
    : 'ACTIVE';

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
    }
  });
}

// Manejar cancelación
async function handleSubscriptionCancelled(stripeSubscription) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSubscription.id }
  });

  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'CANCELLED',
      plan: 'FREE'
    }
  });

  await prisma.auditLog.create({
    data: {
      action: 'SUBSCRIPTION_CANCELLED',
      entity: 'Subscription',
      entityId: subscription.id,
      userId: subscription.userId
    }
  });
}

// Manejar pago exitoso
async function handleInvoicePaid(invoice) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription }
  });

  if (!subscription) return;

  await prisma.auditLog.create({
    data: {
      action: 'PAYMENT_SUCCEEDED',
      entity: 'Subscription',
      entityId: subscription.id,
      userId: subscription.userId,
      metadata: {
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        invoiceId: invoice.id
      }
    }
  });
}

// Manejar pago fallido
async function handlePaymentFailed(invoice) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription }
  });

  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'PAST_DUE' }
  });

  // Aquí enviar notificación al usuario
  // notificationService.sendPaymentFailed(subscription.userId);
}

// Cancelar suscripción
export async function cancelSubscription(userId, immediately = false) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId }
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('No hay suscripción activa');
  }

  if (immediately) {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
  } else {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: !immediately,
      status: immediately ? 'CANCELLED' : subscription.status
    }
  });

  return { cancelled: true, immediately };
}

// Obtener estado de suscripción
export async function getSubscriptionStatus(userId) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId }
  });

  if (!subscription) {
    return {
      plan: 'FREE',
      status: 'ACTIVE',
      features: SUBSCRIPTION_PLANS.FREE.features
    };
  }

  const plan = SUBSCRIPTION_PLANS[subscription.plan] || SUBSCRIPTION_PLANS.FREE;

  return {
    plan: subscription.plan,
    status: subscription.status,
    features: plan.features,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
  };
}

// Obtener planes disponibles
export function getAvailablePlans() {
  return Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
    id: key,
    ...plan
  }));
}

// Crear pago único (para funcionalidades adicionales)
export async function createPaymentIntent(amount, currency = 'mxn', metadata = {}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe usa centavos
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true
    }
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
}

export default {
  getOrCreateCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook,
  cancelSubscription,
  getSubscriptionStatus,
  getAvailablePlans,
  createPaymentIntent,
  SUBSCRIPTION_PLANS
};
