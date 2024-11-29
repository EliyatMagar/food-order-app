import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "food processing" }, // Changed to String type
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;


/*
Explanation
status: Changed from Date to String type with a default of "food processing".
date: Changed Date.now() to Date.now (without parentheses) in the default property to ensure it sets the current date correctly at the time of order creation.

*/