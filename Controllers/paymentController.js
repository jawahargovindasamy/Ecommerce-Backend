import Stripe from "stripe";
import doten from "dotenv";

doten.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    const line_items = items.map((item) => {
      if (item.product || !item.product.price) {
        throw new Error("Invalid product data, Missing Product or Price");
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.floor(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({
      meassage: "Internal Server Error while creating checkout",
      error: error.message,
    });
  }
};
