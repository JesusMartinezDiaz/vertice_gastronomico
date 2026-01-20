/**
 * Servicio de SMS y WhatsApp - Twilio
 * Vértice Gastronómico
 */

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'AC_placeholder',
  process.env.TWILIO_AUTH_TOKEN || 'auth_placeholder'
);

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '+15005550006';
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

// Templates de mensajes
const messageTemplates = {
  alertCritical: {
    es: (data) => `🚨 ALERTA CRÍTICA - ${data.restaurantName}\n\n${data.message}\n\nRevisalo en el dashboard ahora.`,
    en: (data) => `🚨 CRITICAL ALERT - ${data.restaurantName}\n\n${data.message}\n\nCheck dashboard now.`
  },
  alertWarning: {
    es: (data) => `⚠️ ADVERTENCIA - ${data.restaurantName}\n\n${data.message}`,
    en: (data) => `⚠️ WARNING - ${data.restaurantName}\n\n${data.message}`
  },
  orderReady: {
    es: (data) => `✅ ${data.restaurantName}\n\nTu pedido #${data.orderNumber} está listo para recoger.\n\n¡Gracias por tu preferencia!`,
    en: (data) => `✅ ${data.restaurantName}\n\nYour order #${data.orderNumber} is ready for pickup.\n\nThank you!`
  },
  reservationConfirm: {
    es: (data) => `🍽️ ${data.restaurantName}\n\nTu reservación está confirmada:\n📅 ${data.date}\n⏰ ${data.time}\n👥 ${data.guests} personas\n\n¡Te esperamos!`,
    en: (data) => `🍽️ ${data.restaurantName}\n\nYour reservation is confirmed:\n📅 ${data.date}\n⏰ ${data.time}\n👥 ${data.guests} guests\n\nSee you there!`
  },
  reservationReminder: {
    es: (data) => `⏰ RECORDATORIO - ${data.restaurantName}\n\nTu reservación es ${data.when}:\n📅 ${data.date} a las ${data.time}\n👥 ${data.guests} personas\n\n¿Necesitas modificarla? Responde a este mensaje.`,
    en: (data) => `⏰ REMINDER - ${data.restaurantName}\n\nYour reservation is ${data.when}:\n📅 ${data.date} at ${data.time}\n👥 ${data.guests} guests\n\nNeed to modify? Reply to this message.`
  },
  promotionalOffer: {
    es: (data) => `🎉 ${data.restaurantName}\n\n${data.offerTitle}\n\n${data.offerDescription}\n\nVálido hasta: ${data.validUntil}\n\nMuestra este mensaje para aplicar.`,
    en: (data) => `🎉 ${data.restaurantName}\n\n${data.offerTitle}\n\n${data.offerDescription}\n\nValid until: ${data.validUntil}\n\nShow this message to redeem.`
  },
  verificationCode: {
    es: (data) => `Tu código de verificación Vértice es: ${data.code}\n\nVálido por 10 minutos.`,
    en: (data) => `Your Vértice verification code is: ${data.code}\n\nValid for 10 minutes.`
  },
  welcomeMessage: {
    es: (data) => `¡Hola ${data.name}! 👋\n\nBienvenido a ${data.restaurantName}. Ahora recibirás actualizaciones sobre tus pedidos y reservaciones.\n\nResponde STOP para cancelar.`,
    en: (data) => `Hello ${data.name}! 👋\n\nWelcome to ${data.restaurantName}. You'll now receive updates about your orders and reservations.\n\nReply STOP to unsubscribe.`
  },
  dailyReport: {
    es: (data) => `📊 REPORTE DIARIO - ${data.restaurantName}\n\n💰 Ventas: $${data.sales}\n📦 Pedidos: ${data.orders}\n⭐ Satisfacción: ${data.satisfaction}%\n\nVe el detalle en tu dashboard.`,
    en: (data) => `📊 DAILY REPORT - ${data.restaurantName}\n\n💰 Sales: $${data.sales}\n📦 Orders: ${data.orders}\n⭐ Satisfaction: ${data.satisfaction}%\n\nSee details in your dashboard.`
  }
};

// Enviar SMS
export async function sendSMS(to, message) {
  try {
    // Formatear número si no tiene código de país
    const formattedNumber = to.startsWith('+') ? to : `+52${to.replace(/\D/g, '')}`;

    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: formattedNumber
    });

    console.log(`✅ SMS enviado: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ Error enviando SMS:', error.message);
    return { success: false, error: error.message };
  }
}

// Enviar WhatsApp
export async function sendWhatsApp(to, message) {
  try {
    // Formatear número para WhatsApp
    const cleanNumber = to.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('52') ? cleanNumber : `52${cleanNumber}`;

    const result = await client.messages.create({
      body: message,
      from: TWILIO_WHATSAPP,
      to: `whatsapp:+${formattedNumber}`
    });

    console.log(`✅ WhatsApp enviado: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ Error enviando WhatsApp:', error.message);
    return { success: false, error: error.message };
  }
}

// Enviar mensaje con template
export async function sendTemplateMessage(channel, templateName, to, data, lang = 'es') {
  const template = messageTemplates[templateName];
  if (!template) {
    return { success: false, error: 'Template no encontrado' };
  }

  const message = template[lang]?.(data) || template.es(data);

  if (channel === 'sms') {
    return sendSMS(to, message);
  } else if (channel === 'whatsapp') {
    return sendWhatsApp(to, message);
  }

  return { success: false, error: 'Canal no válido' };
}

// Enviar alerta crítica (ambos canales)
export async function sendCriticalAlert(to, data) {
  const results = {
    sms: null,
    whatsapp: null
  };

  // Enviar por ambos canales para alertas críticas
  results.sms = await sendTemplateMessage('sms', 'alertCritical', to, data);
  results.whatsapp = await sendTemplateMessage('whatsapp', 'alertCritical', to, data);

  return results;
}

// Enviar notificación de pedido listo
export async function sendOrderReadyNotification(to, orderData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'orderReady', to, orderData);
}

// Enviar confirmación de reservación
export async function sendReservationConfirmation(to, reservationData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'reservationConfirm', to, reservationData);
}

// Enviar recordatorio de reservación
export async function sendReservationReminder(to, reservationData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'reservationReminder', to, reservationData);
}

// Enviar código de verificación
export async function sendVerificationCode(to, code, channel = 'sms') {
  return sendTemplateMessage(channel, 'verificationCode', to, { code });
}

// Enviar oferta promocional
export async function sendPromotionalOffer(to, offerData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'promotionalOffer', to, offerData);
}

// Enviar mensaje de bienvenida
export async function sendWelcomeMessage(to, userData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'welcomeMessage', to, userData);
}

// Enviar reporte diario
export async function sendDailyReport(to, reportData, channel = 'whatsapp') {
  return sendTemplateMessage(channel, 'dailyReport', to, reportData);
}

// Enviar mensaje masivo (con rate limiting)
export async function sendBulkMessages(channel, templateName, recipients, data, lang = 'es') {
  const results = [];
  const BATCH_SIZE = 10;
  const DELAY_MS = 1000; // 1 segundo entre lotes

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    const batchPromises = batch.map(recipient =>
      sendTemplateMessage(channel, templateName, recipient.phone, {
        ...data,
        name: recipient.name
      }, lang)
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.map((result, idx) => ({
      phone: batch[idx].phone,
      ...result
    })));

    // Esperar entre lotes
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  return {
    total: recipients.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

// Webhook handler para respuestas
export async function handleIncomingMessage(body) {
  const from = body.From?.replace('whatsapp:', '');
  const message = body.Body?.toLowerCase().trim();

  // Manejar comandos básicos
  if (message === 'stop' || message === 'cancelar') {
    // Aquí actualizar preferencias del usuario en la base de datos
    return {
      action: 'unsubscribe',
      response: '✅ Has sido dado de baja de las notificaciones. Puedes volver a suscribirte desde la app.'
    };
  }

  if (message === 'help' || message === 'ayuda') {
    return {
      action: 'help',
      response: '📱 Comandos disponibles:\n\n• STOP - Cancelar notificaciones\n• HELP - Ver esta ayuda\n• RESERVAR - Hacer una reservación\n• MENU - Ver el menú\n\n¿En qué podemos ayudarte?'
    };
  }

  if (message.includes('reservar') || message.includes('reservación')) {
    return {
      action: 'reservation_intent',
      response: '🍽️ Para hacer una reservación, por favor indica:\n\n1. Fecha deseada\n2. Hora preferida\n3. Número de personas\n\nO visita nuestra app para una experiencia completa.'
    };
  }

  // Respuesta por defecto
  return {
    action: 'unknown',
    response: 'Gracias por tu mensaje. Un agente te responderá pronto. Para ayuda inmediata escribe HELP.'
  };
}

// Verificar estado del servicio
export async function checkTwilioStatus() {
  try {
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    return {
      status: 'connected',
      accountName: account.friendlyName,
      accountStatus: account.status
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

export default {
  sendSMS,
  sendWhatsApp,
  sendTemplateMessage,
  sendCriticalAlert,
  sendOrderReadyNotification,
  sendReservationConfirmation,
  sendReservationReminder,
  sendVerificationCode,
  sendPromotionalOffer,
  sendWelcomeMessage,
  sendDailyReport,
  sendBulkMessages,
  handleIncomingMessage,
  checkTwilioStatus
};
