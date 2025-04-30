const amqp = require('amqplib');

async function startWorker() {
    const conn = await amqp.connect('amqp://localhost'); 
    const channel = await conn.createChannel();

    const queue = 'calc_requests';
    const resultQueue = 'calc_results';

    await channel.assertQueue(queue, { durable: false });
    await channel.assertQueue(resultQueue, { durable: false });

    console.log("Press CTRL+C to exit", queue);

    channel.consume(queue, async (msg) => {
        const { n1, n2, op } = JSON.parse(msg.content.toString());
        if (op === 'add') {
            const result = n1 + n2;
          //  console.log(` Performing addition: ${n1} + ${n2} = ${result}`);

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
    });
}

startWorker().catch(console.error);
