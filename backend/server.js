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

let items = [];
let id = 0;
let currentwishlist = [];

app.post('/api/gifts', (req, res) => {
  let item = {
    name: req.body.name,
    price: req.body.price,
    id: crypto.randomUUID()
  };
  items.push(item);
  res.send(item);
});

app.get('/api/gifts', (req, res) => {
  res.send(items);
});

app.put('/api/gifts/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => {
    return item.id;
  });
  let index = itemsMap.indexOf(id);
  if (index === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  let item = items[index];
  item.task = req.body.task;
  item.completed = req.body.completed;
  res.send(item);
});

app.delete('/api/gifts/:id', (req, res) => {
  let id = req.params.id;
  let removeIndex = items.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

//GET /api/hwList
app.get('/api/wishlist', (req, res) => {
  res.send(currentwishlist)
});

// POST /api/wishlist/:id
app.post('/api/wishlist/:id', (req, res) => {
  let sentId = req.params.id;
    let index = currentwishlist.map(item => {
      return item.id;
    })
    .indexOf(sentId);
    if (index === -1) {
      let item = {
        id: sentId,
        quantity: 1,
        name: req.body.name
      }
      currentwishlist.push(item);
      res.send(item);
    }
    else {
      currentwishlist[index].quantity += 1;
      res.send(currentwishlist[index]);
    }
});

// PUT /api/wishlist/:id/:quantity
app.put('/api/wishlist/:id/:quantity', (req, res) => {
  let id = req.params.id;
  let quantity = parseInt(req.params.quantity);
  let index = currentwishlist.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (index === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  if (quantity === 0) {
      currentwishlist.splice(index, 1);
  }
  else {
    currentwishlist[index].quantity = quantity;
  }
  res.send(currentwishlist[index]);
});

// DELETE /api/wishlist/:id
app.delete('/api/wishlist/:id', (req, res) => {
    let id = req.params.id;
  let removeIndex = currentwishlist.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  currentwishlist.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));