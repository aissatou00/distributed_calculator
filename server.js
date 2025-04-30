const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let channel;

async function connectToRabbitMQ() {
    try {
        const conn = await amqp.connect('amqp://rabbitmq');
        channel = await conn.createChannel();
        await channel.assertQueue('calc_requests', { durable: false });
        await channel.assertQueue('calc_results', { durable: false });
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        setTimeout(connectToRabbitMQ, 5000); // Retry after 5 seconds
    }
}

connectToRabbitMQ();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/calculate', async (req, res) => {
    const { n1, n2, op } = req.body;

    if (!channel) {
        return res.status(500).send("RabbitMQ channel is not initialized");
    }

    const msg = JSON.stringify({ n1: parseInt(n1), n2: parseInt(n2), op });
    channel.sendToQueue('calc_requests', Buffer.from(msg));

    // Consume the result
    channel.consume('calc_results', (resultMsg) => {
        if (resultMsg !== null) {
            const result = JSON.parse(resultMsg.content.toString());
            res.json(result);
            channel.ack(resultMsg);
        }
    }, { noAck: false });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
