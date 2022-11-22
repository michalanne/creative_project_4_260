const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/gifts', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const giftSchema = new mongoose.Schema({
  name: String,
  price: String,
});

const wishlistSchema = new mongoose.Schema({
  currWishlist: [giftSchema],
});

giftSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
const Gift = mongoose.model('Gift', giftSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// let items = [];
// let id = 0;
// let currWishlist = [];

// app.post('/api/gifts', (req, res) => {
//   let item = {
//     name: req.body.name,
//     price: req.body.price,
//     id: crypto.randomUUID()
//   };
//   items.push(item);
//   res.send(item);
// });

app.post('/api/gifts', async (req, res) => {
  // console.log(Gifts);
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

// app.get('/api/gifts', (req, res) => {
//   res.send(items);
// });

app.get('/api/gifts', async (req, res) => {
  try {
    let gifts = await Gift.find();
    res.send({gifts: gifts});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// app.put('/api/gifts/:id', (req, res) => {
//   let id = parseInt(req.params.id);
//   let itemsMap = items.map(item => {
//     return item.id;
//   });
//   let index = itemsMap.indexOf(id);
//   if (index === -1) {
//     res.status(404)
//       .send("Sorry, that item doesn't exist");
//     return;
//   }
//   let item = items[index];
//   item.task = req.body.task;
//   item.completed = req.body.completed;
//   res.send(item);
// });

// app.delete('/api/gifts/:id', (req, res) => {
//   let id = req.params.id;
//   let removeIndex = items.map(item => {
//       return item.id;
//     })
//     .indexOf(id);
//   if (removeIndex === -1) {
//     res.status(400)
//       .send("Sorry, that item doesn't exist");
//     return;
//   }
//   items.splice(removeIndex, 1);
//   res.sendStatus(200);
// });

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

//GET /api/hwList
// app.get('/api/Wishlist', (req, res) => {
//   res.send(Wishlist)
// });

app.get('/api/Wishlist', async (req, res) => {
  console.log("in get wishlist");
  debugger
  try {
    let wishlist = await Wishlist.find();
    res.send({wishlist: wishlist});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// app.get('/api/Wishlist', async (req, res) => {
//   try {
//     let gifts = await Gift.find();
//     res.send({gifts: gifts});
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// POST /api/Wishlist/:id
// app.post('/api/Wishlist/:id', (req, res) => {
//   let sentId = req.params.id;
//     let index = currWishlist.map(item => {
//       return item.id;
//     })
//     .indexOf(sentId);
//     if (index === -1) {
//       let item = {
//         id: sentId,
//         quantity: 1,
//         name: req.body.name
//       }
//       currWishlist.push(item);
//       res.send(item);
//     }
//     else {
//       currWishlist[index].quantity += 1;
//       res.send(currWishlist[index]);
//     }
// });

app.post('/api/Wishlist/:id', async (req, res) => {
    const wishlist = new Wishlist({
    name: req.body.name,
    price: req.body.price //takes in a gift item into the aray instead of a name and price?
  });
  try {
    Wishlist.currWishlist.push(wishlist);
    await Wishlist.save();
    res.send({wishlist:wishlist});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// DELETE /api/Wishlist/:id
// app.delete('/api/Wishlist/:id', (req, res) => {
//     let id = req.params.id;
//   let removeIndex = currWishlist.map(item => {
//       return item.id;
//     })
//     .indexOf(id);
//   if (removeIndex === -1) {
//     res.status(400)
//       .send("Sorry, that item doesn't exist");
//     return;
//   }
//   currWishlist.splice(removeIndex, 1);
//   res.sendStatus(200);
// });

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