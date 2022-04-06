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
                <NavBar currentUser={currentUser} />
                <Component {...pageProps} />
            </CartItemContext.Provider>  
            <Footer />
        </div>
    );
}
    
AppComponent.getInitialProps = async (appContext) => {

    const client = buildClient(appContext.ctx);
    // console.log('CLIENT ', client)
    // console.log('CONTEXT IN APP ', appContext)

    let pageProps = {};
    // const { data } = await client.get('/api/users/currentuser');
    // console.log('data in app ', data);
    // return data

    const products = await client.get('/api/products');
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
            return {pageProps, ...products.data, ...currentUser.data}
        } else {
            console.log('None empty object', currentUser.data) 
            if( appContext.Component.getInitialProps) {
                pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
            }
            return {pageProps, ...products.data, ...currentUser.data}
       }
    }
    ////////////
    // const currentUser = await client.get('/api/users/currentuser');
    // if( appContext.Component.getInitialProps) {
    //     pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
    // }
    // return {pageProps, ...products.data, ...currentUser.data}





    ///////////
    // const currentUser = await client.get('/api/users/currentuser');
    // console.log('PRODUCT DATA ', products.data)
    // if( appContext.Component.getInitialProps) {
    //     pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, products.data);
    // }

    // client.get('/api/users/currentuser')
    // .then(res => {
    //     console.log('Current User response ', res);
    //     return {pageProps, ...products.data, ...currentUser.data} 
    // })
    // .catch(err => {
    //     console.log('ERROR IN GET CURRENT USER');
    //     let currentUser = {};
    //     return {pageProps, ...products.data, currentUser} 
    // })
    //const currentUser = await client.get('/api/users/currentuser');
    
    //console.log('CURRENT USER ', currentUser)
    //console.log('pageProps ', pageProps)

    // return {pageProps, ...products.data, ...currentUser.data}
    //return {pageProps, ...products.data} 





    // try {
    //     const res = await client.get('/api/users/currentuser');
    //     console.log('GET PROPS FROM APP PAGE')

    //     if( appContext.Component.getInitialProps) {
    //         // pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, res.data.currentUser);
    //         pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    //     }
    //     console.log('pageProps ', pageProps)
    //     return {
    //         pageProps,
    //         ...res.data
    //     }
    // } catch(err) {
    //     console.log('ERROR IN _APP')
    //     return {pageProps}
    // }
};

export default AppComponent;