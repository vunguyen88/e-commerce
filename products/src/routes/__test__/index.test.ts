import request from "supertest";
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

it('can fetch a list of products', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            name: 'jean',
            price: 10,
            size: ['S', 'M', 'L', 'XL'],
            details: 'details for jeans',
            reviews: ['look great'],
            type: 'street',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            name: 'ribbon dress',
            price: 10,
            size: ['S', 'M',],
            details: 'office dress details',
            reviews: ['look awesome'],
            type: 'office',
            color: ['black', 'yellow'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })

    const response = await request(app)
        .get('/api/products')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
})