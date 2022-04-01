import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@vuelaine-ecommerce/common";
import { queueGrouopName } from "./queue-group-name";
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGrouopName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the product that the order is reserving
        console.log('ORDER RECEIVE IN LISTENER FROM PRODUCT SERVICE ', data);
        let products = data.products;
        for (const item in products) {
            console.log('PROCESS PRODUCT ', products[item])
            const product = await Product.findById(products[item].id);
            console.log('Find product Id')
            if (!product) {
                throw new Error('Product not found');
            }

            // mark the product as being reserved by setting its orderId property
            product.set({ orderId: data.id });

            // save the product
            await product.save();
            // Publish new update product
            await new ProductUpdatedPublisher(this.client).publish({
                id: product.id,
                version: product.version,
                name: product.name,
                price: product.price,
                userId: product.userId,
                size: product.size,
                details: product.details,
                reviews: product.reviews,
                type: product.type,
                category: product.category,
                color: product.color,
                productUrl: product.productUrl,
                orderId: product.orderId
            })
        }
        // ack the message after all products updated
        msg.ack();

        //const product = await Product.findById(data.product.id);

        // if no product, throw error
        // if (!product) {
        //     throw new Error('Product not found');
        // }

        // mark the product as being reserved by setting its orderId property
        //product.set({ orderId: data.id });

        // save the product
        //await product.save();
        // await new ProductUpdatedPublisher(this.client).publish({
        //     id: product.id,
        //     version: product.version,
        //     name: product.name,
        //     price: product.price,
        //     userId: product.userId,
        //     size: product.size,
        //     details: product.details,
        //     reviews: product.reviews,
        //     type: product.type,
        //     category: product.category,
        //     color: product.color,
        //     productUrl: product.productUrl,
        //     orderId: product.orderId
        // })

        // ack the message
        // msg.ack();
    }
}