import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@vuelaine-ecommerce/common';
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Product } from '../../../models/product';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save product
    const orderId = mongoose.Types.ObjectId().toHexString();
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
    product.set({ orderId })
    await product.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        product: {
            id: product.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, data, product, orderId, listener }
};

it('updates the product, publish an', async () => {
    const { listener, product, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedProduct = await Product.findById(product.id);
    expect(updatedProduct!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})