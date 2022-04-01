import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { ProductCreatedListener } from './events/product-created-listener';
import { ProductUpdatedListener } from './events/product-updated-listener';

//console.clear();

const stan = nats.connect('e-commerce', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit(); 
    });

    // already implement in Listener class
    // const options = stan
    //     .subscriptionOptions()
    //     .setManualAckMode(true)
    //     .setDeliverAllAvailable()
    //     .setDurableName('order');

    // already implement in ProductCreatedListener subclass
    // const subscription = stan.subscribe(
    //     'product:created', 
    //     'order-service-queue-group',
    //     options
    // );

    // already implement in Listener class
    // subscription.on('message', (msg: Message) => {
    //     const data = msg.getData();

    //     if (typeof(data) === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    //     }

    //     msg.ack();
    // });

    new ProductCreatedListener(stan).listen();
    // listen to product update channel
    new ProductUpdatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




