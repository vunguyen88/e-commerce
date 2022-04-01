import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@vuelaine-ecommerce/common';
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save product
    const product = Product.build({
        //id: mongoose.Types.ObjectId().toHexString(),
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

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'sdfsdf',
        product: {
            id: product.id,
            name: product.name,
            price: product.price,
            userId: product.id,
            productUrl: product.productUrl,
            details: product.details,
            type: product.type,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, product, data, msg };
}

it('sets the userId of the product', async () => {
    const { listener, product, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedProduct = await Product.findById(product.id);
    console.log('updateProduct ', updatedProduct)
    expect(updatedProduct!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
    const { listener, product, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a product updated event', async () => {
    const { listener, product, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const productUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(productUpdatedData.orderId);
})