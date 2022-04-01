import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../app';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

const sessionCookie = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: '1fsdlkj324sdf',
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

it('has a route handler listening to /api/products for post request', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({})
    
    expect(response.status).not.toEqual(404);
});

it('can only access if the user signed in', async () => {
    await request(app)
        .post('/api/products')
        .send({})
        .expect(401)
});

it('return  a status other than 401 if the user is signed in', async () => {
    

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({});

    expect(response.status).not.toEqual(401)
});

it('return an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            name: '',
            price: 10
        })
        .expect(400)
    
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            price: 10
        })
        .expect(400)
});

it('return an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            name: 'safdsf',
            price: -10
        })
        .expect(400)
    
    await request(app)
        .post('/api/products')
        .set('Cookie', sessionCookie())
        .send({
            title: 'sfsdf',
        })
        .expect(400)
});

it('create a producs with a valid input', async () => {
    // add in a check to make sure a ticket was saved
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    await request(app)
    .post('/api/products')
    .set('Cookie', sessionCookie())
    .send({
        name: 'product 1',
        price: 20,
        size: ['S', 'M', 'L', 'XL'],
        details: 'details',
        reviews: ['look great'],
        type: 'asd',
        color: ['red', 'blue'],
        productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
    })
    .expect(201)

    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].price).toEqual(20);
    expect(products[0].name).toEqual('product 1');
});

// it('publishes an event', async () => {
//     await request(app)
//     .post('/api/products')
//     .set('Cookie', sessionCookie())
//     .send({
//         name: 'safdsf',
//         price: 20,
//         size: ['S', 'M', 'L', 'XL'],
//         details: 'details',
//         reviews: ['look great'],
//         type: 'asd',
//         color: ['red', 'blue'],
//         productUrl: 'https://unsplash.com/photos/FO4mQZi1c0M'
//     })
//     .expect(201)

//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// });