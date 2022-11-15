import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch(error) {
      setError("error retrieving cart: " + error);
    }
  }
  
  
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  
  const addCart = async(product) => {
    try {
      await axios.post("/api/cart/" + product.id, product);
    } catch(error) {
      setError("error adding to cart" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);

  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice("");
  }

  const AddToCart = async(product) => {
    await addCart(product);
    fetchCart();
  }
  
  const incrementQuantity = async(product) => {
    await addCart(product);
    fetchCart();
  }
  
  const decrementQuantity = async(product) => { //put('/api/cart/:id/:quantity',
    try {
      await axios.put("/api/cart/minus/", product);
      fetchCart();
    } catch(error) {
      setError("error decrementing from cart " + error);
    }
  }
  
  const removeFromCart = async(product) => { //delete('/api/cart/:id'
    try {
      await axios.delete("/api/cart/" + product.id);
      fetchCart();
    } catch(error) {
      setError("error removing from cart" + error);
    }
  }

  // render results
  return (
    <div className="App">
      {error}
      <h1>Cart</h1>
      {cart.map( item => (
        <div key={item.id}>
          {item.name}, {item.quantity}
          <button onClick={e => decrementQuantity(item)}>-</button>
          <button onClick={e => incrementQuantity(item)}>+</button>
          <button onClick={e => removeFromCart(item)}>Remove from Cart</button>
        </div>
      ))}
      <h1>Products</h1>
      {products.map( product => (
        <div key={product.id} className="product">
          {product.name}, {product.price}
          <button onClick={e => AddToCart(product)}>Add to Cart</button>
        </div>
      ))}     
    </div>
  );
}

export default App;