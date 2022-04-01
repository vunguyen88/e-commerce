import { Subjects, Publisher, PaymentCreatedEvent } from '@vuelaine-ecommerce/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}