import mongoose from "mongoose";

export const connecDB=async()=>{

    await mongoose.connect("mongodb://localhost:27017/foodOrder-database").then(()=>{
        console.log("Db connected")
    })
}