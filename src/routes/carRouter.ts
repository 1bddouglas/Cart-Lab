import express from "express";
import CartItem from "../models/CartItem";

const cartRouter = express.Router();

// dummy database
const cartItems: CartItem[] = [
  { product: "Book", price: 20, quantity: 2, id: 1 },
  { product: "Book", price: 300, quantity: 1, id: 2 },
  { product: "DVD", price: 15, quantity: 3, id: 3 },
  { product: "Bread", price: 3, quantity: 4, id: 4 },
  { product: "TV", price: 800, quantity: 1, id: 5 },
  { product: "Candy", price: 2, quantity: 10, id: 6 },
];
let nextId: number = 5;
// make endpoints

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: CartItem[] = cartItems;
  if (maxPrice) {
    filteredArray = filteredArray.filter((item) => {
      return item.price <= +maxPrice;
    });
  }
  if (prefix) {
    filteredArray = filteredArray.filter((item) => {
      return item.product.startsWith(prefix as string);
    });
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, +pageSize);
  }
  res.status(200);
  res.json(filteredArray);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  const desiredId: number = +req.params.id;
  const foundLocation: number = cartItems.findIndex((item) => {
    return item.id === desiredId;
  });
  if (foundLocation !== -1) {
    res.status(200);
    res.json(cartItems[foundLocation]);
  } else {
    res.status(404);
    res.json({ message: `Cart item with id ${desiredId} not found.` });
  }
});

cartRouter.post("/cart-items", (req, res) => {
  const newItem: CartItem = req.body;
  newItem.id = nextId;
  nextId = nextId + 1;
  cartItems.push(newItem);
  res.status(201);
  res.json(newItem);
});

// only post and put can use req.body

cartRouter.put("/cart-items/:alien", (req, res) => {
  // what needs to be updated: (path params / route params --- because of ":")
  const idImUpdating: number = +req.params.alien;
  // how to update it: (body)
  const updatedItem: CartItem = req.body;
  // where to update (need location/index)
  const foundIndex: number = cartItems.findIndex((item) => {
    return item.id === idImUpdating;
  });
  // if obj was found:
  if (foundIndex !== -1) {
    // update database
    cartItems[foundIndex] = updatedItem;
    // send correct response (status code and body)
    res.status(200);
    res.json(updatedItem);
  } else {
    res.status(404);
    res.json({ message: `Cart item with id ${idImUpdating} not found.` });
  }
});

cartRouter.delete("/cart-items/:deleteThisId", (req, res) => {
  const idToDelete: number = +req.params.deleteThisId;
  // where is that thing
  const foundIndex: number = cartItems.findIndex((item) => {
    return item.id === idToDelete;
  });
  // did it find that thing
  if (foundIndex !== -1) {
    cartItems.splice(foundIndex, 1);
    res.sendStatus(204);
  } else {
    // if it didn't find that thing
    res.status(404);
    res.json({ message: `Cart item with id ${idToDelete} not found.` });
  }
});

export default cartRouter;
