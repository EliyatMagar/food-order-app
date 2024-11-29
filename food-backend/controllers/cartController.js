import userModel from "../models/userModel.js";

//add items to user cart
// const addToCart=async(req,res)=>{
//   const {userId,itemId,quantity}=req.body;

//   try {
//     const user=await userModel.findById(userId);

//     if(!user){
//         return res.status(404).json({success:false,message:"user not found"})
//     }

//     //check if item already exist in the cart
//     if(user.cartData[itemId]){
//         //if item exists, update the quantity
//         user.cartData[itemId]+=quantity;
//     }else{
//         //if item doesnot exist add it with the given quantity

//         user.cartData[itemId]=quantity;
//     }


//     await user.save();

//     return res.status(200).json({success:true,message:"Item added to cart"})
//   } catch (error) {
//     return res.status(500).json({success:false,message:error.message})
//   }
// };



//Add items to user cart
const addToCart = async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  try {
    console.log("Received userId: ", userId); // Debugging

    // Check if the userId is valid
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is missing" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Found user: ", user); // Debugging

    // Check if item already exists in the cart
    if (user.cartData[itemId]) {
      // If item exists, update the quantity
      user.cartData[itemId] += 1;
    } else {
      // If item doesn't exist, add it with the given quantity
      user.cartData[itemId] = 1;
    }

    // Mark cartData as modified if using nested objects
    user.markModified('cartData');

    // Save the user with updated cartData
    await user.save();

    console.log("Updated user cart data: ", user.cartData); // Debugging

    return res.status(200).json({ success: true, message: "Item added to cart", cartData: user.cartData });
  } catch (error) {
    console.error("Error while adding to cart: ", error); // Log the error
    return res.status(500).json({ success: false, message: error.message });
  }
};


// const addToCart =async(req,res)=>{
//   try {
//     let userData=await userModel.findOne({_id:req.body.userId});

//     let cartData=await userData.cartData;

//     if(!cartData[req.body.itemId]){
//       cartData[req.body.itemId]=1;
//     }else{
//       cartData[req.body.itemId]+=1;
//     }

//     await userModel.findByIdAndUpdate(req.body.userId,{cartData});

//     res.json({success:true,message:"Added to cart"});
//   } catch (error) {
//     console.error("Error while adding to cart: ", error); // Log the error
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }


// Remove items from user cart
// const removeFromCart = async (req, res) => {
//   const { userId, itemId } = req.body;

//   try {
//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if the item exists in the cart and delete it
//     if (user.cartData[itemId]) {
//       delete user.cartData[itemId];
//     } else {
//       return res.status(400).json({ success: false, message: "Item not found in cart" });
//     }

//     await user.save();

//     return res.status(200).json({ success: true, message: "Item removed from cart", cartData: user.cartData });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    console.log("Received userId: ", userId); // Debugging
    console.log("Received itemId: ", itemId); // Debugging

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User cartData before removal: ", user.cartData); // Debugging

    // Check if the item exists in the cart
    if (user.cartData[itemId]) {
      // Decrement the quantity by 1
      user.cartData[itemId] -= 1;

      // If quantity reaches 0, remove the item entirely from the cart
      if (user.cartData[itemId] <= 0) {
        delete user.cartData[itemId];
      }
    } else {
      console.log(`Item with ID ${itemId} not found in cart`); // Debugging
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

    // Mark cartData as modified
    user.markModified("cartData");
    await user.save();

    console.log("User cartData after removal: ", user.cartData); // Debugging

    return res.status(200).json({ success: true, message: "One quantity removed from cart", cartData: user.cartData });
  } catch (error) {
    console.error("Error while removing item from cart: ", error); // Log the error
    return res.status(500).json({ success: false, message: error.message });
  }
};




// Get user cart
// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }

//   try {
//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       cartData: user.cartData,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

const getCart=async(req,res)=>{
  const {userId}=req.body;

  if(!userId){
    return res.status(404).json({success:false,message:"invalid input"})
  }

  try {
    const user=await userModel.findById(userId);
    if(!user){
      return res.status(404).json({success:false,message:"User not found"});
    }
    return res.status(200).json({
      success:true,
      cartData:user.cartData,
    });
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}

export {addToCart,removeFromCart,getCart};