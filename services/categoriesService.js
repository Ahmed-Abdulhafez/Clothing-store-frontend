import api from "@/lib/axios";

// get all categories
export async function getCategories() {
  try {
    const res = await api.get("/categories");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// get single category by id
export async function getCategoryById(id) {
  try {
    const res = await api.get(`/categories/${id}`);

    return res.data.category ?? res.data.data ?? res.data;
  } catch (error) {
    console.error(
      "Error fetching category:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

// create category
export async function createCategory(categoryData) {
 try {
    const formData = new FormData();

    formData.append("name", categoryData.name.trim());

    if (categoryData.image) {
      formData.append("images", categoryData.image);
    }

    const res = await api.post(
      `/categories`,
      formData
    );

    return res.data.category ?? res.data.data ?? res.data;
  } catch (error) {
    console.error(
      "Error added category:",
      error.response?.data || error.message
    );

    throw error;
  }
}

// update category
export async function updateCategory(id, updatedCategory) {
  try {
    const formData = new FormData();

    formData.append("name", updatedCategory.name.trim());

    if (updatedCategory.image) {
      formData.append("images", updatedCategory.image);
    }

    const res = await api.put(
      `/categories/${id}`,
      formData
    );

    return res.data.category ?? res.data.data ?? res.data;
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response?.data || error.message
    );

    throw error;
  }
}

// delete Category
export async function deleteCategory(id) {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
