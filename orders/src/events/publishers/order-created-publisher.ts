import { Publisher, OrderCreatedEvent, Subjects } from "@vuelaine-ecommerce/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

