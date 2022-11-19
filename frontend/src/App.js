import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [gifts, setgifts] = useState([]);
  const [wishlist, setwishlist] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchgifts = async() => {
    try {      
      const response = await axios.get("/api/gifts");
      setgifts(response.data);
    } catch(error) {
      setError("error retrieving gifts: " + error);
    }
  }
  
  const fetchwishlist = async() => {
    try {      
      const response = await axios.get("/api/wishlist");
      setwishlist(response.data);
      console.log("this is wishlist:",wishlist);
      console.log("gifts in getwishlist", gifts);
    } catch(error) {
      setError("error retrieving wishlist: " + error);
    }
  }
  
  
  const creategift = async() => {
    try {
      await axios.post("/api/gifts", {name: name, price: price});
    } catch(error) {
      setError("error adding a gift: " + error);
    }
  }
  
  const addwishlist = async(gift) => {
    try {
      const response = await axios.post("/api/wishlist/" + gift.id, gift);
      console.log("response data", response.data);
    } catch(error) {
      setError("error adding to wishlist" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchgifts();
  },[]);

  const addgift = async(e) => {
    e.preventDefault();
    await creategift();
    fetchgifts();
    setName("");
    setPrice("");
  }

  const AddTowishlist = async(gift) => {
    console.log("add to wishlist", gift);
    await addwishlist(gift);
    fetchwishlist();
  }
  
  const incrementQuantity = async(gift) => {
    await addwishlist(gift);
    fetchwishlist();
  }
  
  const decrementQuantity = async(gift) => { //put('/api/wishlist/:id/:quantity',
    try {
      console.log("gift id: ", gift.id);
      let quantity = gift.quantity-1;
      await axios.put("/api/wishlist/" + gift.id + "/" + quantity); //fixme
      fetchwishlist();
    } catch(error) {
      setError("error decrementing from wishlist " + error);
    }
  }
  
  const removeFromwishlist = async(gift) => { //delete('/api/wishlist/:id'
    try {
      await axios.delete("/api/wishlist/" + gift.id);
      fetchwishlist();
    } catch(error) {
      setError("error removing from wishlist" + error);
    }
  }

  // render results
  return (
    <div className="App">
      {error}
      <h1>wishlist</h1>
      {wishlist.map( item => (
        <div key={item.id}>
          {item.name}, {item.quantity}
          <button onClick={e => decrementQuantity(item)}>-</button>
          <button onClick={e => incrementQuantity(item)}>+</button>
          <button onClick={e => removeFromwishlist(item)}>Remove from wishlist</button>
        </div>
      ))}
      <h1>gifts</h1>
      {gifts.map( gift => (
        <div key={gift.id} className="gift">
          {gift.name}, {gift.price}
          <button onClick={e => AddTowishlist(gift)}>Add to wishlist</button>
        </div>
      ))}     
    </div>
  );
}

export default App;