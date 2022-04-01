import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Product } from '../../models/product';
import jwt from 'jsonwebtoken';
import { natsWrapper } from '../../nats-wrapper';

const sessionCookie = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
        role: 'admin'
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string thats the cookie with the enconded data
    return [`express:sess=${base64}`];
}

it('return a 404 if the provided id does not exist', async () => {
    // create new mongoDB id
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', sessionCookie())
        .send({
            name: 'fsdfsd',
            price: 20
        })
        .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
     // create new mongoDB id
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/products/${id}`)
        .send({
            name: 'fsdfsd',
            price: 20,
            size: ["XS", "L", "updated"],
            details: 'details',
            reviews: ['look great'],
            type: 'asd',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })
        .expect(401);
});

it('return a 401 if the provided id does not exist', async () => {

});

it('return 404 if the user is not admin', async () => {

});

it('return 400 if the user provide an invalid product name or price', async () => {

});

it('updates the product provided valid input', async () => {

});

it('publishes an event', async () => {
    const cookie = sessionCookie();

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', cookie)
        .send({
            name: 'product 1',
            price: 20,
            size: ["XS", "L"],
            details: 'details',
            reviews: ['look great'],
            type: 'asd',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        });

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'product 1 updated',
            price: 90,
            size: ["XS", "L", "updated"],
            details: 'details updated',
            reviews: ['look great', 'fit well'],
            type: 'updated',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the product is reserved', async () => {
    const cookie = sessionCookie();

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', cookie)
        .send({
            name: 'product 1',
            price: 20,
            size: ["XS", "L"],
            details: 'details',
            reviews: ['look great'],
            type: 'asd',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        });

    const product = await Product.findById(response.body.id);
    product!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
    await product!.save();

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'product 1 updated',
            price: 90,
            size: ["XS", "L", "updated"],
            details: 'details updated',
            reviews: ['look great', 'fit well'],
            type: 'updated',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })
        .expect(400);
})

