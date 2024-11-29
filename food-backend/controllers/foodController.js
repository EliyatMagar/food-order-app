import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
  // Check if file exists
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No image file uploaded" });
  }

  // Extract file information
  let image_filename = `${req.file.filename}`;

  // Create new food item
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    // Save the food item to the database
    await food.save();
    return res
      .status(201)
      .json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error saving food item" });
  }
};


//display food items

const listFood=async(req,res)=>{
  try {
    const food=await foodModel.find({});
    res.json({success:true,data:food});
  } catch (error) {
    console.log(error);

    res.json({success:false,message:"Error"});
  }

}


//remove food items from database

const removeFood=async(req,res)=>{
  try {
    const food=await foodModel.findById(req.body.id);

    fs.unlink(`uploads/${food.image}`,()=>{})
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({success:true,message:'food deleted'})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { addFood,listFood ,removeFood};
