import { useEffect, useState, useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import Link from 'next/link';
import Router from 'next/router';

import { BsBag, BsPerson, BsBoxArrowInRight, BsGrid1X2 } from "react-icons/bs";
// import { BsPerson } from "react-icons/bs";
import style from '../styles/components/navbar.module.scss';
import CartItemContext from '../context/cartItemContext';

const HomeNav = ({ currentUser }) => {
    const [cartItem, setCartItem] = useState(0);
    const {cartItemCount} = useContext(CartItemContext);
    let cart;
    if (typeof window !== 'undefined') {
        cart = JSON.parse(sessionStorage.getItem('cart'));
    }
    const links = [
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser  &&  { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li key={href}>
                <Link href={href}>
                    <a>{label}</a>
                </Link>
            </li>
        })   

    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
            {/* <Container> */}
                <Navbar.Brand style={{cursor: 'pointer', marginLeft: '2rem'}} onClick={() => Router.push('/')}>E-Commerce</Navbar.Brand>
                {/* <Navbar.Brand href="/">E-Commerce</Navbar.Brand> */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    {/* <NavDropdown title="Products" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                        {/* <Nav.Link href="/products">Products</Nav.Link> */}
                        <Nav.Link onClick={() => Router.push('/products')}>Products</Nav.Link>
                        <Nav.Link onClick={() => Router.push('/locations')}>Locations</Nav.Link>
                        <Nav.Link onClick={() => Router.push('/info')}>Info</Nav.Link>
                        <Nav.Link onClick={() => Router.push('/story')}>Story</Nav.Link>
                        {/* <Nav.Link href="/locations">Locations</Nav.Link> */}
                        {/* <Nav.Link href="/info">Info</Nav.Link>
                        <Nav.Link href="/story">Story</Nav.Link> */}
                    </Nav>
                    <Nav style={{marginRight: '2rem'}}>
                    {/* <Nav.Link href="#deets">More deets</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link> */}
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className={style.search_box}
                                aria-label="Search"
                            />
                            {/* <Button variant="outline-success">Search</Button> */}
                            {/* {currentUser ? currentUser.email : null} */}
                            <Nav.Link href="/cart" className={style.notification}>
                                <BsBag className={style.nav_icon}/>
                                {cartItemCount && cartItemCount > 0 ? <span className={style.cart_notification}>{cartItemCount}</span> : null}
                            </Nav.Link>
                            {currentUser 
                                ? <Nav.Link href="/admin"><BsGrid1X2 className={style.nav_icon}/></Nav.Link> 
                                : null 
                            }
                            {currentUser 
                                ? <Nav.Link href="/auth/signout"><BsBoxArrowInRight className={style.nav_icon}/></Nav.Link> 
                                : <Nav.Link href="/auth/signin"><BsPerson className={style.nav_icon}/></Nav.Link> 
                            }
                            
                            {/* {links} */}
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            {/* </Container> */}
        </Navbar>
    )
};

export default HomeNav;