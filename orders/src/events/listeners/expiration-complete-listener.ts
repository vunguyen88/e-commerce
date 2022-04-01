import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from '@vuelaine-ecommerce/common';
import { Message } from 'node-nats-streaming';
import { queueGrouopName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-canceleed-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGrouopName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg:Message) {
        const order = await Order.findById(data.orderId).populate('product');

        if (!order) {
            throw new Error('Order not found');
        }

        // check to not cancel the order had been paid
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            // products: {
            //     id: order.product.id
            // }
            products: order.products
        });

        msg.ack();
    }
}