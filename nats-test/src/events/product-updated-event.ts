import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated;
    data: {
        id: string;
        name: string;
        price: number;
        userId: string;
        size: string[];
        details: string;
        reviews: string[];
        type: string;
        color: string[];
        productUrl: string;
    }
}