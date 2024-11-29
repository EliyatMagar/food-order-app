import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  // Input validation
  if (!req.body.userId || !req.body.items || !req.body.amount || !req.body.address) {
    return res.status(400).json({ success: false, message: "Missing required order details." });
  }

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100 * 80)
      },
      quantity: item.quantity
    }));

    const DELIVERY_CHARGE = 2 * 100 * 80;
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: DELIVERY_CHARGE
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message || "Error occurred during order placement." });
  }
}

const verifyOrder=async(req,res)=>{
 const {orderId,success}=req.body;
 try {
  if(success==="true"){
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:"Paid"})
  }else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:"Not Paid"})
  }
 } catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"});
 }
}

export { placeOrder,verifyOrder };
