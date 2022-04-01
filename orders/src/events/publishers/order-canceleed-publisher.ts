import { Publisher, Subjects, OrderCancelledEvent } from "@vuelaine-ecommerce/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}