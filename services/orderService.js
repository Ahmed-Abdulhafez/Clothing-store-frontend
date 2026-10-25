
import api from "@/lib/axios";

// معالجة موحدة لاستجابات أخطاء API
async function handleOrderRequest(request) {
  try {
    const res = await request();
    return res.data?.data ?? res.data;
  } catch (error) {
    console.error(
      "Order API Error:",
      error.response?.data?.message || error.message,
    );

    throw error;
  }
}

// 1. Get All Orders (Admin Only)
export async function getAllOrders() {
  return handleOrderRequest(() => api.get("/orders"));
}

// 2. Get User Orders
export async function getUserOrders() {
  return handleOrderRequest(() => api.get("/orders/my-orders"));
}

// 3. Get Single Order By ID
export async function getOrderById(id) {
  return handleOrderRequest(() =>
    api.get(`/orders/${encodeURIComponent(id)}`)
  );
}

// 4. Create New Order From Cart
export async function createNewOrder(cartId, orderData = {}) {
  return handleOrderRequest(() =>
    api.post(`/orders/${encodeURIComponent(cartId)}`, orderData)
  );
}

// 5. Update Order To Paid (Admin Only)
export async function updateOrderToPaid(id, paymentData = {}) {
  return handleOrderRequest(() =>
    api.put(`/orders/${encodeURIComponent(id)}/pay`, paymentData)
  );
}

// 6. Update Order To Delivered (Admin Only)
export async function updateOrderToDelivered(id, deliveryData = {}) {
  return handleOrderRequest(() =>
    api.put(`/orders/${encodeURIComponent(id)}/deliver`, deliveryData)
  );
}

// 7. Create Stripe Checkout Session
export async function createCheckoutSession(cartId, checkoutData = {}) {
  return handleOrderRequest(() =>
    api.post(
      `/orders/checkout-session/${encodeURIComponent(cartId)}`,
      checkoutData,
    )
  );
}

