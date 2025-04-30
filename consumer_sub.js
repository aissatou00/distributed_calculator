const amqp = require('amqplib');

async function startWorker() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const requestQueue = 'calc_requests';
    const resultQueue = 'calc_results';

    await channel.assertQueue(requestQueue, { durable: false });
    await channel.assertQueue(resultQueue, { durable: false });

    console.log(" [*] Sub Worker waiting for messages. To exit press CTRL+C");

    channel.consume(requestQueue, async (msg) => {
        const { n1, n2, op } = JSON.parse(msg.content.toString());
        if (op === 'sub') {
            const result = n1 - n2;
            const delay = Math.floor(Math.random() * 10000) + 5000;

            setTimeout(() => {
                const resultMsg = JSON.stringify({ n1, n2, op, result });
                channel.sendToQueue(resultQueue, Buffer.from(resultMsg));
                console.log(` [-] Sub result sent: ${resultMsg}`);
            }, delay);
        }
        channel.ack(msg);
    });
}

startWorker().catch(console.error);
