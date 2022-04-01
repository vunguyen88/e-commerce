import { Publisher, Subjects, ProductCreatedEvent } from '@vuelaine-ecommerce/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
