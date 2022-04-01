import nats from 'node-nats-streaming';
import { ProductCreatedPublisher } from './events/product-created-publisher';

const stan = nats.connect('e-commerce', 'test', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new ProductCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '123',
            name: 'yellow dress',
            price: 99
        })
    } catch (err) {
        console.error(err);
    }
    

    // const data = JSON.stringify({
    //     id: '123',
    //     name: 'black dress',
    //     price: 30
    // });

    // stan.publish('product:created', data, () => {
    //     console.log('Event published');
    // })
});