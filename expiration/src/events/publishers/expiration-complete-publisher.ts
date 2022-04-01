import { Subjects, Publisher, ExpirationCompleteEvent } from "@vuelaine-ecommerce/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}