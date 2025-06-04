import e from "express";
import Cart from "../Models/cartModel.js";
import Product from "../Models/productModel.js";

//add to cart

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }
    cart.totalPrice += product.price * quantity;

    await cart.save();
    res
      .status(200)
      .json({ message: "Product added to cart successfully", data: cart });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while adding  product to cart",
      error: error.message,
    });
  }
};

//view cart
export const viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", data: { items: [] } });
    }
    res.status(200).json({ message: "Cart Fetched Successfully", data: cart });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while fetching cart",
      error: error.message,
    });
  }
};

//remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      const removeItem = cart.items.splice(itemIndex, 1)[0];
      cart.totalPrice -=
        removeItem.quantity * (await Product.findById(productId)).price;
      await cart.save();
      res.status(200).json({
        message: "Product removed from cart successfully",
        data: cart,
      });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while removing product from cart",
      error: error.message,
    });
  }
};

//update cart quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body; // change can be +1 or -1
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += change; //cart.items[0].quantity = cart.items[0].quantity + change;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
      cart.totalPrice += change * (await Product.findById(productId)).price;
      await cart.save();
      res.status(200).json({
        message: "Cart quantity updated successfully",
        data: cart,
      });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while updating cart quantity",
      error: error.message,
    });
  }
};
