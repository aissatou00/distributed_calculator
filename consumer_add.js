const amqp = require('amqplib');

async function startWorker() {
    const conn = await amqp.connect('amqp://localhost'); 
    const ch = await conn.createChannel();

    const queue = 'calc_requests';
    await ch.assertQueue(queue, { durable: false });

    const resultQueue = 'calc_results';
    await ch.assertQueue(resultQueue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    ch.consume(queue, async (msg) => {
        const { n1, n2, op } = JSON.parse(msg.content.toString());
        if (op === 'add') {
            const result = n1 + n2;
          //  console.log(` Performing addition: ${n1} + ${n2} = ${result}`);

            const delay = Math.floor(Math.random() * 10000) + 5000;
            setTimeout(() => {
                const resultMsg = JSON.stringify({
                    n1, n2, op, result
                });
                ch.sendToQueue(resultQueue, Buffer.from(resultMsg));
                console.log(`  Sent result: ${resultMsg}`);
            }, delay);
        }
        ch.ack(msg);
    });
}

startWorker().catch(console.error);
