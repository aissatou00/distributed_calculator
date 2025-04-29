const amqp = require('amqplib');

const operations = ['add', 'sub', 'mul', 'div', 'all'];

async function produce() {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const queue = 'calc_requests';

    await ch.assertQueue(queue, { durable: false });

    setInterval(() => {
        const n1 = Math.floor(Math.random() * 100);
        const n2 = Math.floor(Math.random() * 100);
        const op = operations[Math.floor(Math.random() * operations.length)];

        const msg = JSON.stringify({ n1, n2, op });
        ch.sendToQueue(queue, Buffer.from(msg));
        console.log(` [x] Sent: ${msg}`);
    }, 5000);
}

produce().catch(console.error);
