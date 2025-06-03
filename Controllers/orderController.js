import Order from "../Models/orderModel.js";
import Cart from "../Models/cartModel.js";
import sendEmail from "../Utils/mailer.js";

//Place Order
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Add Items to Cart First" });
    }
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const order = new Order({
      user: req.user._id,
      products: cart.items,
      totalPrice,
      status: "Pending",
    });
    await order.save();
    if (cart) {
      await Cart.findOneAndDelete({ user: req.user._id });
    }
    try {
      const userMail = req.user.email;
      await sendEmail(
        userMail,
        "Order Placed Successfully",
        `Your Order is Placed at the total price of ${totalPrice}.
             If you have any query related to your order, please contact us at support@example.com.
             If the order is not placed by you, Kindly revert back to us immediately.`
      );
    } catch (error) {
      console.log("Error while sending Email", error.message);
    }
    res
      .status(201)
      .json({ message: "Order Placed Successfully and Email Sent", order });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while Placing Order",
      error: error.message,
    });
  }
};

//Get myOrder Details

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );
    res
      .status(200)
      .json({ message: "My Orders Fetched Successfully", data: orders });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while Fetching Orders",
      error: error.message,
    });
  }
};

//Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res
      .status(200)
      .json({ message: "All Orders Fetched Successfully", data: orders });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while Fetching Orders",
      error: error.message,
    });
  }
};

//Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order Status Updated Successfully",
      data: updateOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while Updating Order Status",
      error: error.message,
    });
  }
};
