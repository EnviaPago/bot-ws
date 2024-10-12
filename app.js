const express = require('express');
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Crear una instancia de Express
const app = express();

// Flujos para las diferentes opciones según la elección numérica
const flowHorario = addKeyword('1', 'strict') // Responde solo si el usuario envía exactamente "1"
    .addAnswer('Nuestro horario es:\nLunes a Viernes de 8:00am a 5:00pm\nSábados de 8:00am a 1:00pm🇻🇪🏦');

const flowFuncionamiento = addKeyword('2', 'strict') // Responde solo si el usuario envía exactamente "2"
    .addAnswer('EnviaPago es una casa de cambio virtual que recibe remesas desde varios países del mundo y las entrega en Venezuela. Todo es 100% online. Solo debes ingresar en EnviaPago.com y rellenar los formularios de pago.');

const flowTasaCambio = addKeyword('3', 'strict') // Responde solo si el usuario envía exactamente "3"
    .addAnswer('La tasa de cambio de EnviaPago está siempre por encima del Banco Central de Venezuela y se actualiza diariamente en EnviaPago.com.');

const flowTiempoRemesa = addKeyword('4', 'strict') // Responde solo si el usuario envía exactamente "4"
    .addAnswer('Recibirás tu pago en bolívares en un plazo máximo de 12 horas hábiles después de recibir la transferencia en moneda extranjera.');

const flowNoRecibido = addKeyword('5', 'strict') // Responde solo si el usuario envía exactamente "5"
    .addAnswer('Un gusto en saludarte, estimado cliente. Te contactaremos pronto. Recomendaciones:\n1) Verifica que tu pago esté correctamente cargado.\n2) Asegúrate de ser el titular de la cuenta de origen.\n3) Revisa todos los datos de envío.');

const flowProblemasPagina = addKeyword('6', 'strict') // Responde solo si el usuario envía exactamente "6"
    .addAnswer('Por favor, comenta qué problemas estás presentando para poder brindarte una ayuda personalizada.');

const flowUrgente = addKeyword('7', 'strict') // Responde solo si el usuario envía exactamente "7"
    .addAnswer('¿Indícame en qué puedo ayudarte?');

const flowNoCargaComprobante = addKeyword('8', 'strict') // Responde solo si el usuario envía exactamente "8"
    .addAnswer('Para que su comprobante se cargue correctamente, es necesario contar con una solicitud de pago previa que contenga todos los datos y especificaciones correspondientes. Puede solicitar dicha solicitud a través del siguiente enlace: https://enviapago.com/form.');

const flowMonedas = addKeyword('9', 'strict') // Responde solo si el usuario envía exactamente "9"
    .addAnswer('Las monedas que manejamos en EnviaPago son las siguientes:\n- Euros 💶\n- Dólares 💵\n- Pesos Colombianos 🇨🇴');

const flowPaisEnvio = addKeyword('10', 'strict') // Responde solo si el usuario envía exactamente "10"
    .addAnswer('¡Puedes enviar dinero desde cualquier país del mundo! 🌍💸 EnviaPago está disponible globalmente para facilitar tus transacciones.');

const flowPrincipal = addKeyword(['hola', 'alo'], 'strict') // Responde si el usuario dice "hola" o "alo"
    .addAnswer(
        `Buenas, espero estés bien 🤩. Te comunicas con Raúl Briceño, agente de soporte técnico de EnviaPago. ¿Cómo puedo ayudarte?\n\nPor favor, elige una de las siguientes opciones respondiendo con el número correspondiente:
        1️⃣ ¿Cuál es el horario de trabajo? 🗓️
        2️⃣ ¿Cómo funciona EnviaPago? 👨🏻‍💻
        3️⃣ ¿Qué tasa de cambio usamos? 🏦
        4️⃣ ¿En cuánto tiempo recibo mi remesa? ⏰
        5️⃣ No he recibido mi remesa
        6️⃣ Tengo problemas con la página
        7️⃣ Urgente
        8️⃣ ¿Por qué no carga mi comprobante?
        9️⃣ ¿Qué monedas manejan? 💰
        🔟 ¿Desde qué país puedo enviar dinero? 🌍`
    );

// Flujo para manejar entradas no válidas
const flowInvalidInput = addKeyword('*', 'strict')
    .addAnswer('Lo siento, no existe esa opción. Por favor, elige un número del 1 al 10.');

// Crear el flujo principal con todos los flujos
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
        flowPrincipal,
        flowFuncionamiento,
        flowTasaCambio,
        flowTiempoRemesa,
        flowNoRecibido,
        flowProblemasPagina,
        flowUrgente,
        flowNoCargaComprobante,
        flowPaisEnvio,
        flowMonedas,
        flowHorario,
        flowInvalidInput // Agrega el flujo para entradas no válidas
    ]);
    const adapterProvider = createProvider(WebWhatsappProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
}

// Cambia esta parte para que escuche en el puerto de Railway
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Railway
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

main();
