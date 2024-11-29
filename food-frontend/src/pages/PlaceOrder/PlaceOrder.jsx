import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, url } = useContext(StoreContext);
     // Fetch userId from localStorage when needed
 
   const storedUser = JSON.parse(localStorage.getItem("user"));
   const userId=storedUser?.id; // Return userId or undefined if not available


  const storedToken = localStorage.getItem('token');
  console.log(storedToken);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const totalAmount = getTotalCartAmount();
    const orderData = {
      userId:userId,
      address: data,
      items: orderItems,
      amount: totalAmount + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error in processing the order. Please verify your information and try again.");
      }
    }catch (error) {
      console.error("Order submission failed:", error);
      if (error.response) {
          console.log("Server responded with:", error.response.data);
          console.log("Status code:", error.response.status);
      }
      if (!error.response) {
          alert("Network error. Please check your internet connection.");
      } else if (error.response.status === 401) {
          alert("Authorization error. Please log in again.");
      } else {
          alert("Error occurred while placing the order. Please try again.");
      }
  }
  
  };
  

  const totalAmount = getTotalCartAmount();
  const deliveryFee = totalAmount === 0 ? 0 : 2;

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Second Name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="street" />
        <div className="multi-field">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-field">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{totalAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{totalAmount + deliveryFee}</b>
            </div>
          </div>
          <button type="submit" disabled={totalAmount === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
