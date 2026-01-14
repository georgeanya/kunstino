// src/lib/api/user.ts
const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

// User Types
interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

interface CreateUserResponse {
  status: string;
  message: string;
  data: {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Order Types
interface OrderItem {
  artwork_id: string;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

interface CreateOrderRequest {
  customer_id: string;
  items: OrderItem[];
  payment_method: string;
  shipping_address: ShippingAddress;
}

interface OrderResponse {
  status: string;
  message: string;
  data: {
    order_id: string;
    customer_id: string;
    order_date: string;
    total_amount: number;
    currency: string;
    status: string;
    items: Array<{
      artwork_id: string;
      title: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
    shipping_address: ShippingAddress;
    payment_method: string;
  };
}

// Create User Function
export async function createUser(
  userData: CreateUserRequest
): Promise<CreateUserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create user: ${response.statusText}`
      );
    }

    const data: CreateUserResponse = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to create user");
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Create Order Function
export async function createOrder(
  orderData: CreateOrderRequest
): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/order/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create order: ${response.statusText}`
      );
    }

    const data: OrderResponse = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Optional: Get order by ID
export async function getOrderById(
  orderId: string
): Promise<OrderResponse["data"]> {
  try {
    const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch order: ${response.statusText}`
      );
    }

    const data: OrderResponse = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch order");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

// Optional: Get user's orders
export async function getUserOrders(
  customerId: string
): Promise<OrderResponse["data"][]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${customerId}/orders`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch user orders: ${response.statusText}`
      );
    }

    const data: ApiResponse<{ orders: OrderResponse["data"][] }> =
      await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch user orders");
    }

    return data.data?.orders || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

// Helper type for API responses (if not already defined elsewhere)
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
