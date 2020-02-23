const {ServiceBusClient, ReceiveMode} = require("@azure/service-bus");

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const main = async () => {

    const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient = sbClient.createQueueClient(queueName);
    const receiver = queueClient.createReceiver(ReceiveMode.receiveAndDelete);

    console.log('receive message start');
    try {
        const messages = await receiver.receiveMessages(5, 1);
        console.log(messages.map(message => message.body));

        await queueClient.close();
        console.log('receive message end');
    } finally {
        await sbClient.close();
    }
};

main().catch(err => {
    console.log(err);
});