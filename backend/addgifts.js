

const axios = require("axios");

const gifts = require("./gifts.js");

const baseURL = "http://localhost:3000";

gifts.forEach(async (gift) => {
  const response = await axios.post(`${baseURL}/api/gifts`, gift);
  if (response.status != 200)
    console.log(`Error adding ${gift.name}, code ${response.status}`);
});