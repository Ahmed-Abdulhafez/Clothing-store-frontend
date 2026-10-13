import api from "@/lib/axios";

// get all categories
export  async function getCategories() {
    try {
        const res = await api.get("/categories");
        return res.data.data;
    }catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

// get single category by id
export async function getCategoryById(id) {
    try{
        const res = await api.get(`/categories/${id}`);
        return res.data.data;
    }catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

// create category
export async function createCategory(categoryData) {
    try {
        const res = await api.post("/categories", categoryData);
        return res.data.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

// update category
export async function updateCategory(id, updatedCategory) {
    try {
        const res = await api.put(`/categories/${id}`, updatedCategory);
        return res.data.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}
