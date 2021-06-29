import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Navbar, Products, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMesasage] = useState("");

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
    
        setProducts(data);
      };

      const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
      };

      const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);
    
        setCart(cart);
      };
    
      const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });
    
        setCart(cart);
      };
    
      const handleRemoveFromCart = async (productId) => {
        const { response } = await commerce.cart.remove(productId);
    
        setCart(response.cart);
      };
    
      const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();
    
        setCart(response.cart);
      };

      const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
      }

      const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);   
          
          setOrder(incomingOrder);

          refreshCart();
        } catch (error) {
          setErrorMesasage(error.data.error.message);
          
        }
      }


      useEffect(() => {
        fetchProducts();
        fetchCart();
      }, []);

    
      const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
      <Router>
      <div>        
        <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle}/>
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart cart={cart}  handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />
          </Route>
          <Route path="/checkout" exact>
            <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />
          </Route>
        </Switch>
      </div>
    </Router>
    )
}

export default App;