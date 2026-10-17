import api from "@/lib/axios";

// API Add product to cart
export async function addToCart(cartData) {
  try {
    const res = await api.post("/carts", cartData);

    return res.data.data;
  } catch (error) {
    console.error(
      "Error adding product to cart:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

// API Get My Cart
export async function getUserCart() {
  try {
    const res = await api.get("/carts");

    return res.data;
  } catch (error) {
    console.error(
      "Error fetching user cart:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

// API Clear entire cart
export async function clearEntireCart() {
  try {
    const res = await api.delete("/carts");

    return res.data.data;
  } catch (error) {
    console.error(
      "Error clearing cart:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

// API Update specific cart item quantity
export async function updateSpecificQuantity(id, quantity) {
  try {
    const res = await api.put(`/carts/${id}`, {
      quantity,
    });

    return res.data.data;
  } catch (error) {
    console.error(
      "Error updating cart quantity:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

// API Remove specific item from cart
export async function removeCartItem(id) {
  try {
    const res = await api.delete(`/carts/${id}`);

    return res.data.data;
  } catch (error) {
    console.error(
      "Error removing cart item:",
      error.response?.data || error.message,
    );

    throw error;
  }
}



// طريقه اخري للدوال واكثر احترافيه

// export async function getUserCart() {
//   try {
//     const { data } = await api.get("/carts");

//     return data;
//   } catch (error) {
//     console.error("Error fetching user cart:", {
//       status: error.response?.status,
//       message: error.response?.data?.message || error.message,
//       data: error.response?.data,
//     });

//     throw error;
//   }
// }