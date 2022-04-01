import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@vuelaine-ecommerce/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log('data in PAYMENT SERVICE ', data);
        console.log('TOTAL PAYMENT FOR ORDER ', data.products.reduce((preValue, currentValue) => preValue + currentValue.price*currentValue.count, 0))
        const order = Order.build({
            id: data.id,
            price: data.products.reduce((preValue, currentValue) => preValue + currentValue.price*currentValue.count, 0),
            status: data.status,
            userId: data.userId,
            version: data.version
        });
        await order.save();

        msg.ack();
    }
}