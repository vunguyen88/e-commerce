import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { ProductCreatedEvent } from "@vuelaine-ecommerce/common";
import { ProductCreatedListener } from "../product-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from '../../../models/product';

const setup = async () => {
    // create an instance of listener
    const listener = new ProductCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: ProductCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        name: 'product 1',
        price: 80,
        userId: new mongoose.Types.ObjectId().toHexString(),
        size: ['M'],
        details: 'product 1 details',
        reviews: [],
        type: '',
        color: ['yellow'],
        productUrl: 'url',
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg }
};

it('creates and save a ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created!
    const product = await Product.findById(data.id);

    expect(product).toBeDefined();
    expect(product!.name).toEqual(data.name);
    expect(product!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions function to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
})