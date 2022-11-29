import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  
  // setup state
  const [gifts, setGifts] = useState([]);
  const [Wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  

  const fetchgifts = async() => {
    try {      
      const response = await axios.get("/api/gifts");
      setGifts(response.data.gifts);
    } catch(error) {
      setError("error retrieving gifts: " + error);
    }
  }
  
  const fetchWishlist = async() => {
    try {      
      const response = await axios.get("/api/Wishlist");
      setWishlist(response.data.wishlistGet);
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
      const response = await axios.put("/api/Wishlist/" + gift._id, gift);
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
    // setQuantity(quantity + 1);
  }

  const AddToWishlist = async(gift) => {
    await addWishlist(gift);
    // setQuantity(gift.quantity + 1);
    fetchWishlist();
  }
  
  const incrementQuantity = async(gift) => {
    await addWishlist(gift);
    setQuantity(gift.quantity+1);
    // await gift.save();
    fetchWishlist();
  }
  
  const decrementQuantity = async(gift) => { //put('/api/Wishlist/:id/:quantity',
    try {
      let quantity = gift.quantity-1;
      await axios.put("/api/Wishlist/" + gift._id + "/" + quantity); //fixme
      fetchWishlist();
    } catch(error) {
      setError("error decrementing from Wishlist " + error);
    }
  }
  
  const removeFromWishlist = async(gift) => { //delete('/api/Wishlist/:id'
    try {
      await axios.delete("/api/Wishlist/" + gift._id);
      fetchWishlist();
    } catch(error) {
      setError("error removing from Wishlist" + error);
    }
  }

  // render results
  return (
    <div className="App">
      <head>
        <title>Christmas Wishlist</title>
      </head>
      {error}
      <body>
      <div className="wordback">
      
      <h1>The Ultimate Christmas Wish List Creator</h1>

      <div className  ="wishlistHeader">
        <h2>Wishlist</h2>
        <h3>The things I would like most for Christmas are....</h3>
      </div>
      {Array.from(Wishlist).map( gift => (
        <div key={gift._id} classname="gift">
          {gift.name}, {gift.quantity}
          <button onClick={e => removeFromWishlist(gift)}>Remove from Wishlist</button>
        </div>
      ))}
      <div className  ="giftListHeader">
        <h2>Gift List</h2>
        <h3>All the options I have for gifts are.....</h3>
      </div>
      {gifts.map( gift => (
        <div key={gift.id} className="gift">
          {gift.name}, {gift.price}
          <button onClick={e => AddToWishlist(gift)}>Add to Wishlist</button>
        </div>
      ))}    
      </div>
      </body>
          <footer className="footer">
        <p className="footer-info"><a href="https://github.com/michalanne/creative_project_4_260.git">Michal Stone and Bryce Wall</a></p>
        <p className="footer-info">CS 260</p>
        <p className="footer-info-bottom-right">Merry Christmas!</p>
    </footer>
    </div>
  );
}

export default App;