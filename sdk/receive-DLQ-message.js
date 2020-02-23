const {ServiceBusClient, ReceiveMode} = require("@azure/service-bus");

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME + "/$DeadLetterQueue";

const main = async () => {

    const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient = sbClient.createQueueClient(queueName);
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock);

    console.log('receive DLQ message start');
    try {
        const messages = await receiver.receiveMessages(5, 1);
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            console.log(message.body);
            await message.complete();
        }
        await queueClient.close();
        console.log('receive DLQ message end');
    } finally {
        await sbClient.close();
    }
};

main().catch(err => {
    console.log(err);
});