/**
 * Servicio de Email - Nodemailer + Handlebars
 * Vértice Gastronómico
 */

import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración del transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    // Producción con SMTP real
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Desarrollo - usar ethereal o mailtrap
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'test@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'password'
    }
  });
};

const transporter = createTransporter();

// Configuración del remitente
const FROM_EMAIL = process.env.FROM_EMAIL || 'Vértice Gastronómico <noreply@vertice.mx>';
const BRAND_COLOR = '#C0A062';

// Templates de email
const templates = {
  welcome: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: bold; font-family: 'Playfair Display', serif; }
    .content { padding: 30px; background: #fff; }
    .button { display: inline-block; padding: 15px 30px; background: ${BRAND_COLOR}; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VÉRTICE</div>
      <p style="color: #ccc; margin-top: 5px;">Sistema Gastronómico Inteligente</p>
    </div>
    <div class="content">
      <h2>¡Bienvenido {{name}}!</h2>
      <p>Gracias por unirte a Vértice Gastronómico. Tu cuenta ha sido creada exitosamente.</p>
      <p>Con nuestro sistema de 72 agentes de IA especializados, podrás:</p>
      <ul>
        <li>Optimizar operaciones de tu restaurante</li>
        <li>Analizar finanzas y reducir costos</li>
        <li>Mejorar la experiencia del cliente</li>
        <li>Tomar decisiones basadas en datos</li>
      </ul>
      <a href="{{dashboardUrl}}" class="button">Ir al Dashboard</a>
      <p>Si tienes alguna pregunta, nuestro equipo está aquí para ayudarte.</p>
    </div>
    <div class="footer">
      <p>© 2024 Vértice Gastronómico. Todos los derechos reservados.</p>
      <p>Este correo fue enviado a {{email}}</p>
    </div>
  </div>
</body>
</html>
  `,

  passwordReset: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: bold; }
    .content { padding: 30px; background: #fff; }
    .button { display: inline-block; padding: 15px 30px; background: ${BRAND_COLOR}; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VÉRTICE</div>
    </div>
    <div class="content">
      <h2>Restablecer contraseña</h2>
      <p>Hola {{name}},</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
      <a href="{{resetUrl}}" class="button">Restablecer contraseña</a>
      <div class="warning">
        <strong>⚠️ Importante:</strong> Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
      </div>
      <p>Por seguridad, nunca compartiremos tu información con terceros.</p>
    </div>
    <div class="footer">
      <p>© 2024 Vértice Gastronómico</p>
    </div>
  </div>
</body>
</html>
  `,

  subscriptionConfirmation: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: bold; }
    .content { padding: 30px; background: #fff; }
    .plan-box { background: linear-gradient(135deg, ${BRAND_COLOR}, #a08050); color: #fff; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .features { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .features li { margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VÉRTICE</div>
    </div>
    <div class="content">
      <h2>¡Suscripción activada!</h2>
      <p>Hola {{name}},</p>
      <p>Tu suscripción ha sido procesada exitosamente.</p>
      <div class="plan-box">
        <h3>Plan {{planName}}</h3>
        <p style="font-size: 24px; margin: 10px 0;">{{planPrice}} MXN/mes</p>
      </div>
      <div class="features">
        <h4>Tu plan incluye:</h4>
        <ul>
          {{#each features}}
          <li>✓ {{this}}</li>
          {{/each}}
        </ul>
      </div>
      <p>Tu próxima fecha de facturación es: <strong>{{nextBillingDate}}</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Vértice Gastronómico</p>
    </div>
  </div>
</body>
</html>
  `,

  alertNotification: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: bold; }
    .content { padding: 30px; background: #fff; }
    .alert-critical { background: #f8d7da; border: 2px solid #dc3545; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .alert-warning { background: #fff3cd; border: 2px solid #ffc107; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .alert-info { background: #d1ecf1; border: 2px solid #17a2b8; color: #0c5460; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; padding: 15px 30px; background: ${BRAND_COLOR}; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VÉRTICE</div>
    </div>
    <div class="content">
      <h2>{{alertType}} - {{restaurantName}}</h2>
      <div class="alert-{{alertLevel}}">
        <h3>{{alertTitle}}</h3>
        <p>{{alertMessage}}</p>
        <p><strong>Detectado:</strong> {{timestamp}}</p>
      </div>
      <a href="{{dashboardUrl}}" class="button">Ver en Dashboard</a>
    </div>
    <div class="footer">
      <p>© 2024 Vértice Gastronómico</p>
    </div>
  </div>
</body>
</html>
  `,

  reportReady: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: bold; }
    .content { padding: 30px; background: #fff; }
    .report-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${BRAND_COLOR}; margin: 20px 0; }
    .button { display: inline-block; padding: 15px 30px; background: ${BRAND_COLOR}; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VÉRTICE</div>
    </div>
    <div class="content">
      <h2>📊 Tu reporte está listo</h2>
      <p>Hola {{name}},</p>
      <div class="report-box">
        <h3>{{reportTitle}}</h3>
        <p>{{reportDescription}}</p>
        <p><strong>Período:</strong> {{reportPeriod}}</p>
        <p><strong>Generado por:</strong> Agente {{agentName}}</p>
      </div>
      <a href="{{downloadUrl}}" class="button">Descargar Reporte</a>
    </div>
    <div class="footer">
      <p>© 2024 Vértice Gastronómico</p>
    </div>
  </div>
</body>
</html>
  `
};

// Compilar templates
const compiledTemplates = {};
for (const [name, template] of Object.entries(templates)) {
  compiledTemplates[name] = Handlebars.compile(template);
}

// Enviar email genérico
export async function sendEmail(to, subject, html, text = null) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML si no hay texto
    });

    console.log('✉️ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

// Enviar email de bienvenida
export async function sendWelcomeEmail(user) {
  const html = compiledTemplates.welcome({
    name: user.name,
    email: user.email,
    dashboardUrl: `${process.env.APP_URL || 'http://localhost:5173'}/dashboard`
  });

  return sendEmail(
    user.email,
    '¡Bienvenido a Vértice Gastronómico!',
    html
  );
}

// Enviar email de reset de contraseña
export async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = compiledTemplates.passwordReset({
    name: user.name,
    resetUrl
  });

  return sendEmail(
    user.email,
    'Restablecer contraseña - Vértice Gastronómico',
    html
  );
}

// Enviar confirmación de suscripción
export async function sendSubscriptionEmail(user, plan, nextBillingDate) {
  const html = compiledTemplates.subscriptionConfirmation({
    name: user.name,
    planName: plan.name,
    planPrice: plan.price,
    features: plan.features,
    nextBillingDate: new Date(nextBillingDate).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  return sendEmail(
    user.email,
    `Suscripción ${plan.name} activada - Vértice Gastronómico`,
    html
  );
}

// Enviar notificación de alerta
export async function sendAlertEmail(user, alert) {
  const html = compiledTemplates.alertNotification({
    alertType: alert.type,
    alertLevel: alert.level || 'info',
    alertTitle: alert.title,
    alertMessage: alert.message,
    restaurantName: alert.restaurantName || 'Tu restaurante',
    timestamp: new Date().toLocaleString('es-MX'),
    dashboardUrl: `${process.env.APP_URL || 'http://localhost:5173'}/dashboard/alerts`
  });

  return sendEmail(
    user.email,
    `[${alert.type.toUpperCase()}] ${alert.title} - Vértice`,
    html
  );
}

// Enviar notificación de reporte listo
export async function sendReportReadyEmail(user, report) {
  const html = compiledTemplates.reportReady({
    name: user.name,
    reportTitle: report.title,
    reportDescription: report.description || 'Análisis detallado de tu restaurante',
    reportPeriod: report.period,
    agentName: report.agentName || 'CEO',
    downloadUrl: `${process.env.APP_URL || 'http://localhost:5173'}/reports/${report.id}`
  });

  return sendEmail(
    user.email,
    `Reporte listo: ${report.title} - Vértice Gastronómico`,
    html
  );
}

// Verificar conexión SMTP
export async function verifyConnection() {
  try {
    await transporter.verify();
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionEmail,
  sendAlertEmail,
  sendReportReadyEmail,
  verifyConnection
};
