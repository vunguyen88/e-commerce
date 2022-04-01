import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductCreatedEvent } from '@vuelaine-ecommerce/common';
import { Product } from '../../models/product';
import { queueGrouopName } from './queue-group-name';
import { OrderCreatedPublisher } from '../publishers/order-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../models/order';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
    queueGroupName = queueGrouopName;

    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const { id, name, price, userId, details, size, reviews, color, type, productUrl, category } = data;
        
        const product = Product.build({
            id, 
            name, 
            price,
            userId,
            details,
            size,
            reviews,
            color,
            type,
            productUrl,
            category,
            count: 0,
        });

        await product.save();

        
        msg.ack();
    }
}