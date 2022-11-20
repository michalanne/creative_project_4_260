import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [gifts, setgifts] = useState([]);
  const [Wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchgifts = async() => {
    try {      
      const response = await axios.get("/api/gifts");
      setgifts(response.data.gifts);  //possibly remove gifts at end
    } catch(error) {
      setError("error retrieving gifts: " + error);
    }
  }
  
  const fetchWishlist = async() => {
    try {      
      const response = await axios.get("/api/Wishlist");
      setWishlist(response.data);
      console.log("this is Wishlist:",Wishlist);
      console.log("gifts in getWishlist", gifts);
    } catch(error) {
      setError("error retrieving Wishlist: " + error);
    }
  }
  
  
  const creategift = async() => {
    try {
      await axios.post("/api/gifts", {name: name, price: price});
    } catch(error) {
      setError("error adding a gift: " + error);
    }
  }
  
  const addWishlist = async(gift) => {
    try {
      const response = await axios.post("/api/Wishlist/" + gift.id, gift);
      console.log("response data", response.data);
    } catch(error) {
      setError("error adding to Wishlist" + error);
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

  const AddToWishlist = async(gift) => {
    console.log("add to Wishlist", gift);
    await addWishlist(gift);
    fetchWishlist();
  }
  
  const incrementQuantity = async(gift) => {
    await addWishlist(gift);
    fetchWishlist();
  }
  
  const decrementQuantity = async(gift) => { //put('/api/Wishlist/:id/:quantity',
    try {
      console.log("gift id: ", gift.id);
      let quantity = gift.quantity-1;
      await axios.put("/api/Wishlist/" + gift.id + "/" + quantity); //fixme
      fetchWishlist();
    } catch(error) {
      setError("error decrementing from Wishlist " + error);
    }
  }
  
  const removeFromWishlist = async(gift) => { //delete('/api/Wishlist/:id'
    try {
      await axios.delete("/api/Wishlist/" + gift.id);
      fetchWishlist();
    } catch(error) {
      setError("error removing from Wishlist" + error);
    }
  }

  // render results
  return (
    <div className="App">
      {error}
      <div class  ="wishlistHeader">
        <h1>Wishlist</h1>
      </div>
      {Wishlist.map( item => (
        <div key={item.id}>
          {item.name}, {item.quantity}
          <button onClick={e => decrementQuantity(item)}>-</button>
          <button onClick={e => incrementQuantity(item)}>+</button>
          <button onClick={e => removeFromWishlist(item)}>Remove from Wishlist</button>
        </div>
      ))}
      <div class  ="giftListHeader">
        <h1>Gift List</h1>
      </div>
      {gifts.map( gift => (
        <div key={gift.id} className="gift">
          {gift.name}, {gift.price}
          <button onClick={e => AddToWishlist(gift)}>Add to Wishlist</button>
        </div>
      ))}     
    </div>
  );
}

export default App;