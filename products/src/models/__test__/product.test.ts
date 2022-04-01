import { Product } from '../product';

it('implement optimistic concurrency control', async () => {
    // create an instance of a product
    const product = Product.build({
        name: 'product 1',
        price: 5,
        userId: '123',
        details: 'details',
        size: ['M', 'L'],
        reviews: [],
        color: [],
        type: '',
        productUrl: 'url'
    })

    // save the product to the database
    await product.save();

    // fetch the product twice
    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);

    // make two seperate changes to the products we fetch
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 20 });

    // save the first fetched product
    await firstInstance!.save();

    // save the second fetch product and expect an error
    try {
        await secondInstance!.save()
    } catch (err) {
        return;
    }
        
    throw new Error('Should not reach this point');
})

it('increments the version number on multiple saves', async () => {
    const product = Product.build({
        name: 'product 1',
        price: 5,
        userId: '123',
        details: 'details',
        size: ['M', 'L'],
        reviews: [],
        color: [],
        type: '',
        productUrl: 'url'
    });

    await product.save();
    expect(product.version).toEqual(0);
    await product.save();
    expect(product.version).toEqual(1);
    await product.save();
    expect(product.version).toEqual(2);
});