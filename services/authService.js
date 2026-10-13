import api from "@/lib/axios";


// get all users
export async function getUsers() {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// login user
export async function loginUser(data) {
  try {
    const res = await api.post("/users/login", data);

    return res.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

// register user
export async function registerUser(data) {
  try {
    const res = await api.post("/users/register", data);

    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// logout user
export async function logoutUser() {
  try {
    const res = await api.post("/users/logout");

    return res.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
}

// get user profile
export async function getProfile() {
  try {
    const res = await api.get("/users/profile");

    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// update user profile
export async function updateProfile(data) {
  try {
    const res = await api.put("/users/profile", data);

    return res.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// delete user profile
export async function deleteProfile() {
  try {
    const res = await api.delete("/users/profile");

    return res.data;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
}


// Update user by ID
export async function updatUserById(id, data) {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete user by ID
export async function deleteUserById(id) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}