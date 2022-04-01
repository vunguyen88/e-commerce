import request from 'supertest';
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import { response } from 'express';
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

it('returns a 404 if the ticket is not found', async () => {
    // create new mongoDB id
    const id = new mongoose.Types.ObjectId().toHexString();

    await  request(app)
        .get(`/api/products/${id}`)
        .send()
        .expect(404)
});

it('returns a ticket if the ticket is found', async () => {
    const name = 'safdsf';
    const price = 20;

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            name,
            price,
            size: ['S', 'M', 'L', 'XL'],
            details: 'details',
            reviews: ['look great'],
            type: 'asd',
            color: ['red', 'blue'],
            productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
        })
        .expect(201)
    
    console.log(response.body)

    const productResponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send()
        .expect(200)
    
    expect(productResponse.body.name).toEqual(name)
    expect(productResponse.body.price).toEqual(price)

});
