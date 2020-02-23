const {ServiceBusClient} = require("@azure/service-bus");

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const main = async () => {

    const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient = sbClient.createQueueClient(queueName);
    const sender = queueClient.createSender();

    const message = {
        body: 'Hello. Service Bus',
        label: 'test',
        userProperties: {
            testPropertyName: 'property value'
        }
    };
    console.log('send message start');
    try {
        await sender.send(message);
        await queueClient.close();
        console.log('send message end');
    } finally {
        await sbClient.close();
    }
};

main().catch(err => {
    console.log(err);
});