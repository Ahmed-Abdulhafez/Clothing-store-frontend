import api from "@/lib/axios";

// get all products
export async function getProducts(params = {}) {
  try {
    const res = await api.get("/products", {
      params,
    });

    return res.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// get single product by id
export async function getProductById(id) {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// create product
export async function createProduct(productData) {
  try {
    // 1. تعريف الـ FormData هنا بشكل صحيح
    const formData = new FormData();

    // 2. إضافة الحقول النصية والرقمية
    formData.append("title", productData.title || "");
    formData.append("desc", productData.desc || "");
    formData.append("price", productData.price || 0);
    formData.append("offerPrice", productData.offerPrice || 0);
    formData.append("brand", productData.brand || "Evo");
    formData.append("stock", productData.stock || 0);
    formData.append("category", productData.category || "");
    formData.append("isFeatured", productData.isFeatured || false);
    formData.append(
      "showInProductSlider",
      productData.showInProductSlider || false,
    );
    formData.append("rating", productData.rating || 0);
    formData.append("numReviews", productData.numReviews || 0);

    // 3. إضافة الصور بشكل آمن بعد التأكد من أنها مصفوفة
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      productData.images.forEach((image) => {
        if (image) {
          formData.append("images", image);
        }
      });
    }

    // 4. إرسال الطلب للسيرفر
    const res = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// update product
export async function updateProductService(id, updatedProduct) {
  try {
    const res = await api.put(`/products/${id}`, updatedProduct);
    return res.data.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// delete product
export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// get Slider Products
export async function getSliderProducts() {
  try {
    const res = await api.get("/products/slider");
    return res.data.data;
  } catch (error) {
    console.error("Error product slider:", error);
    throw error;
  }
}
