import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from 'axios';

const Add = () => {
  const url = "http://localhost:4000";

  const [image, setImage] = useState(null); // Initialize to null
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Form validation
    if (!image || !data.name || !data.description || !data.price) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData(); // Capitalized FormData
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        // Reset form data on success
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(null); // Reset image
      } else {
        console.error("Failed to add product:", response.data.message); // Handle failure
      }
    } catch (error) {
      console.error("Error uploading data:", error); // Catch errors
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
            required 
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name="name" 
            placeholder="Type here" 
            required 
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler} 
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here.."
            required
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" onChange={onChangeHandler}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" // Changed to lowercase
              name="price" 
              placeholder="$20"
              required 
            />
          </div>
        </div>
        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
