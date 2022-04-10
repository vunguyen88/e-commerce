import { useState, useEffect } from 'react';
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from "../api/build-client";
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import CartItemContext from "../context/cartItemContext";
// import Zoom from 'react-reveal/Zoom';

const AppComponent = ({ Component, pageProps, products, currentUser }) => {
    const [cartItemCount, setCartItemCount] = useState(0);
    const updateCartItemCount = (count) => {
        setCartItemCount(cartItemCount + count);
    }

    const resetCartItemCount = () => {
        setCartItemCount(0)
    }

    if (typeof window !== 'undefined') {
        let cart = JSON.parse(sessionStorage.getItem('cart'));
        if (cart !== null) {
            let count = cart.reduce((preValue, currentValue) => preValue + currentValue.count, 0);
            if (count > cartItemCount) setCartItemCount(count);
        }  
    }


    return (
        <div >
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <CartItemContext.Provider value={{ cartItemCount: cartItemCount, updateCartItemCount: updateCartItemCount, resetCartItemCount: resetCartItemCount }}>
                <NavBar {...pageProps} currentUser={currentUser} products={products}/>
                <Component {...pageProps} />
            </CartItemContext.Provider>  
            <Footer />
        </div>
    );
}
    
AppComponent.getInitialProps = async (appContext) => {

    const client = buildClient(appContext.ctx); 

    let pageProps = {};

    const products = await client.get('/api/products');
    console.log('products in app ', products.data)
    let currentUser = {};
    try {
        currentUser = await client.get('/api/users/currentuser');
    } 
    catch (err) {
        console.log('ERROR in get currentUser')
    }
    
    finally {
        
        if (currentUser === {}) {
            console.log('Empty object') 
            if( appContext.Component.getInitialProps) {
                pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
            }
            return {pageProps, products: [...products.data], ...currentUser.data}
        } else {
            console.log('None empty object', currentUser.data) 
            if( appContext.Component.getInitialProps) {
                pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
            }
            return {pageProps, products: [...products.data], ...currentUser.data}
       }
    }
};

export default AppComponent;