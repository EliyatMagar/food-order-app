import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create the context
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [error, setError] = useState("");

  // Fetch userId from localStorage when needed
  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?.id; // Return userId or undefined if not available
  };

  const addToCart = async (itemId) => {
    const userId = getUserId(); // Fetch userId dynamically
    const storedToken = localStorage.getItem("token"); // Get token from localStorage
    console.log("Adding item to cart:", itemId);
    console.log("User ID:", userId);
    console.log("Token:", storedToken);

    // Optimistically update the cartItems state
    if (!cartItems[itemId]) {
        setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    // Ensure userId and storedToken are available
    if (!userId || !storedToken) {
        setError("User not logged in or token is missing. Please log in again.");
        return;
    }

    try {
        // Send the userId and itemId to the API
        const response = await axios.post(
            `${url}/api/cart/add`,
            { userId, itemId },
            {
                headers: {
                    Authorization: `Bearer ${storedToken}`, // Send Authorization Bearer token
                },
            }
        );

        console.log("API response:", response.data); // Debugging the API response
    } catch (err) {
        console.error("Failed to add item to cart:", err);
        setError("Failed to add item to the cart. Please try again.");

        // Rollback the optimistic update in case of failure
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
};


  const removeFromCart = async (itemId) => {
    const userId = getUserId();
    const storedToken=localStorage.getItem('token');
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    // Optionally, update the backend here as well
    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { userId, itemId },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      setError("Failed to remove item from the cart. Please try again.");
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo?.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (err) {
      setError("Failed to fetch food list. Please try again later.");
    }
  };

  const loadData = async (userId, token) => {
    try {
        console.log("User ID for loadData:", userId);
        console.log("Token for loadData:", token);

        const response = await axios.post(
            `${url}/api/cart/get`,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setCartItems(response.data.cartData);
    } catch (error) {
        console.log("Error in loadData:", error);
    }
};

  

useEffect(() => {
  const init = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      
      if (!storedToken || !storedUser) {
          console.log("Token or User not found. Please log in.");
          return; // Don't proceed if token or user is missing
      }

      const userId = storedUser.id;
      fetchFoodList();

      // Pass storedToken directly to loadData
      await loadData(userId, storedToken);
  };

  init(); // Call the async function inside useEffect
}, []); // Note: Removed token from the dependency array

 

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    error,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
