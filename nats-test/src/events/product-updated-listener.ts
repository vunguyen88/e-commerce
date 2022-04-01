import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { ProductUpdatedEvent } from './product-updated-event';
import { Subjects } from './subjects';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
    readonly subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
    queueGroupName = 'product-updated'; 

    onMessage(data: ProductUpdatedEvent['data'], msg:Message) {
        console.log('Event data!', data);

        // console.log(data.id);
        // console.log(data.name);
        // console.log(data.price);

        msg.ack();
    }
}