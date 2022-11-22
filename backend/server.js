const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gifts', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const giftSchema = new mongoose.Schema({
  name: String,
  price: String,
});

const wishlistSchema = new mongoose.Schema({
  name: String,
  price: String,
});

giftSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
wishlistSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });  
  
const Gift = mongoose.model('Gift', giftSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);


app.post('/api/gifts', async (req, res) => {
    const gift = new Gift({
    name: req.body.name,
    price: req.body.price
  });
  try {
    await gift.save();
    res.send({gift:gift});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.get('/api/gifts', async (req, res) => {
  try {
    let gifts = await Gift.find();
    res.send({gifts: gifts});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.delete('/api/gifts/:id', async (req, res) => {
  try {
    await Gift.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.get('/api/Wishlist', async (req, res) => {
  console.log("in wishlist get");
  try {
    let wishlistGet = await Wishlist.find();
    console.log("wishlist Get:", wishlistGet);
    res.send({wishlistGet: wishlistGet});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.post('/api/Wishlist/:id', async (req, res) => {
  console.log("in wishlist post--> making object");
    const wishlistPost = new Gift({
      name: req.body.name, 
      price: req.body.price,
  });
  console.log("in wishlist post");
  try {
    // Wishlist.currWishlist.push(wishlist);
    await wishlistPost.save();
    console.log("wishlist", wishlistPost);
    res.send({wishlistPost: wishlistPost});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.delete('/api/Wishlist/:id', async (req, res) => {
  try {
    await Gift.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));