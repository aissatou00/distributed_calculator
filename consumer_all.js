const amqp = require('amqplib');

const OPERATIONS = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => b === 0 ? null : a / b
};

const operation = process.argv[2]; // récupère 'add', 'sub', etc.

if (!OPERATIONS[operation]) {
    console.error("Usage: node worker.js [add|sub|mul|div]");
    process.exit(1);
}

async function startWorker() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const requestQueue = 'calc_requests';
    const resultQueue = 'calc_results';

    await channel.assertQueue(requestQueue, { durable: false });
    await channel.assertQueue(resultQueue, { durable: false });

    console.log(` [*] ${operation.toUpperCase()} worker waiting for messages...`);

    channel.consume(requestQueue, async (msg) => {
        const { n1, n2, op } = JSON.parse(msg.content.toString());

        // Si c'est l'opération exacte OU si c'est "all"
        if (op === operation || op === 'all') {
            const result = OPERATIONS[operation](n1, n2);

            const delay = Math.floor(Math.random() * 10000) + 5000; // 5–15 sec
            setTimeout(() => {
                const resultMsg = JSON.stringify({
                    n1, n2, op: operation, result
                });
                channel.sendToQueue(resultQueue, Buffer.from(resultMsg));
                console.log(` [x] Sent result: ${resultMsg}`);
            }, delay);
        }

        channel.ack(msg);
    });
}

startWorker().catch(console.error);
