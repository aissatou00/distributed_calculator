const amqp = require('amqplib');

const queue = 'calc_requests';
const resultQueue = 'calc_results';
const exchange = 'calc_exchange';
let channel;

async function startWorker() {
    const conn = await amqp.connect('amqp://localhost');
    channel = await conn.createChannel();

    await channel.assertExchange(exchange, 'direct', { durable: false });

    await channel.assertQueue(queue, { durable: false });

    await channel.assertQueue(resultQueue, { durable: false });

    console.log(" Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, async (msg) => {
        const { n1, n2, op } = JSON.parse(msg.content.toString());
        if (op === 'mul') {
            const result = n1 * n2;

            const delay = Math.floor(Math.random() * 10000) + 5000;

            setTimeout(() => {
                const resultMsg = JSON.stringify({
                    n1, n2, op, result
                });
                channel.sendToQueue(resultQueue, Buffer.from(resultMsg));
                console.log(`  Sent result: ${resultMsg}`);
            }, delay);
        }
        channel.ack(msg);
        channel.ack(msg);
    });
}

startWorker().catch(console.error);
