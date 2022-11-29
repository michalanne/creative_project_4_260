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
  inwishlist: Boolean(false),
  quantity: Number,
});

giftSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
const Gift = mongoose.model('Gift', giftSchema);

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
  try {
    let wishlistGet = await Gift.find({inwishlist: true});
    res.send({wishlistGet: wishlistGet});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/Wishlist/:id', async (req, res) => {
  try {
    let gift = await Gift.findOne({
    _id: req.params.id
  });
  gift.inwishlist = true;
  await gift.save();
  res.send(gift);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.delete('/api/Wishlist/:id', async (req, res) => {
  try {
    let gift = await Gift.findOne({
    _id: req.params.id
  });
  gift.inwishlist = false;
  await gift.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));