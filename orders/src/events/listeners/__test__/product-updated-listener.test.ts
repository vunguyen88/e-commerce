import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ProductUpdatedListener } from "../product-updated-listener"; 
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from '../../../models/product';
import { ProductUpdatedEvent } from '@vuelaine-ecommerce/common';

const setup = async () => {
    // create a listener
    const listener = new ProductUpdatedListener(natsWrapper.client);
    // create and save a product
    const product = Product.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: 'product 1',
        price: 80,
        size: ['S', 'M', 'L', 'XL'],
        details: 'details',
        reviews: ['look great'],
        type: 'asd',
        color: ['red', 'blue'],
        userId: mongoose.Types.ObjectId().toHexString(),
        productUrl: 'url',
    })
    await product.save();

    // create a fake data object
    const data: ProductUpdatedEvent['data'] = {
        id: product.id,
        version: product.version + 1,
        name: 'product 1 update',
        price: 120,
        userId: new mongoose.Types.ObjectId().toHexString(),
        size: ['M'],
        details: 'product 1 details',
        reviews: [],
        type: '',
        color: ['yellow'],
        productUrl: 'url',
    }

    // create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    // return all 
    return { msg, data, product, listener };

}

it('finds, updates, and save a ticket', async () => {
    const { msg, data, product, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedProduct = await Product.findById(product.id);

    expect(updatedProduct!.name).toEqual(data.name);
    expect(updatedProduct!.price).toEqual(data.price);
    expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { msg, data, product, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, product } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}
    
    expect(msg.ack).not.toHaveBeenCalled()
})