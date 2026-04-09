//  get carts acc to email id

const Carts = require("../model/Carts");

const getCartByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email || email !== req.decoded.email) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    const query = { email: email };
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { menuItemId, name, recipe, image, price, quantity } = req.body;
  const email = req.decoded.email;
  try {
    const existingCartItem = await Carts.findOne({ menuItemId, email });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in the cart" });
    }
    const cartItem = await Carts.create({
      menuItemId,
      name,
      recipe,
      image,
      price,
      quantity,
      email,
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleting acart item
const deleteCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const existingCart = await Carts.findById(cartId);
    if (!existingCart) {
      return res.status(404).json({ message: "Cart items not found" });
    }
    if (existingCart.email !== req.decoded.email) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    await Carts.findByIdAndDelete(cartId);
    return res.status(200).json({ message: "Cart items deleted successfulyy" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update cart
const updateCart = async (req, res) => {
  const cartId = req.params.id;
  const { quantity } = req.body;

  try {
    const existingCart = await Carts.findById(cartId);
    if (!existingCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (existingCart.email !== req.decoded.email) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    existingCart.quantity = Math.max(1, Number(quantity || 1));
    const updatedCart = await existingCart.save();
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    return res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single recipes
const getSingleCart = async (req, res) => {
  const cartId = req.params.id;

  try {
    const cartItem = await Carts.findById(cartId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (cartItem.email !== req.decoded.email) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartByEmail,
  addToCart,
  deleteCart,
  updateCart,
  getSingleCart,
};
