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
let currentCart = [];

app.post('/api/products', (req, res) => {
  let item = {
    name: req.body.name,
    price: req.body.price,
    id: crypto.randomUUID()
  };
  items.push(item);
  res.send(item);
});

app.get('/api/products', (req, res) => {
  res.send(items);
});

app.put('/api/products/:id', (req, res) => {
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

app.delete('/api/products/:id', (req, res) => {
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


// hwList

//GET /api/hwList
app.get('/api/cart', (req, res) => {
  res.send(currentCart)
});

// POST /api/cart/:id
app.post('/api/cart/:id', (req, res) => {
  let sentId = req.params.id;
    let index = currentCart.map(item => {
      return item.id;
    })
    .indexOf(sentId);
    if (index === -1) {
      let item = {
        id: sentId,
        quantity: 1,
        name: req.body.name
      }
      currentCart.push(item);
      res.send(item);
    }
    else {
      currentCart[index].quantity += 1;
      res.send(currentCart[index]);
    }
});

// PUT /api/cart/:id/:quantity
app.put('/api/cart/:id/:quantity', (req, res) => {
  let id = req.params.id;
  let quantity = parseInt(req.params.quantity);
  let index = currentCart.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (index === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  if (quantity === 0) {
      currentCart.splice(index, 1);
  }
  else {
    currentCart[index].quantity = quantity;
  }
  res.send(currentCart[index]);
});

app.put('/api/cart/minus/', (req, res) => {
  let id = req.body.id; //or it could be the id from the url ig
  let index = currentCart.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (index === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  let q = currentCart[index].quantity;
  if (q === 1) {
    currentCart.splice(index, 1);
  }
  else {
    currentCart[index].quantity = q-1; //why isn't it printing out the new number?!?!
  }
  console.log("new quantity: ", currentCart[index].quantity, " old quantity: ", q);
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
    let id = req.params.id;
  let removeIndex = currentCart.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(400)
      .send("Sorry, that item doesn't exist");
    return;
  }
  currentCart.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));