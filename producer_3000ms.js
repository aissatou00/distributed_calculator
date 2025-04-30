const amqp = require('amqplib');

const operations = ['add', 'sub', 'mul', 'div'];

async function produce() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    const queue = 'calc_requests';

    await channel.assertQueue(queue, { durable: false });

    const sendMessage = () => {
        const n1 = Math.floor(Math.random() * 100);
        const n2 = Math.floor(Math.random() * 100);
        const op = operations[Math.floor(Math.random() * operations.length)];

        const message = JSON.stringify({ n1, n2, op });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(` [x] Sent: ${message}`);

        const nextDelay = Math.floor(Math.random() * 1000) + 2000; 
        setTimeout(sendMessage, nextDelay);
    };

    sendMessage(); 
}

produce().catch(console.error);
