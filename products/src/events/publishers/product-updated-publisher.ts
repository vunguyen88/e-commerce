import { Publisher, Subjects, ProductUpdatedEvent } from '@vuelaine-ecommerce/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
