const API_URL = "https://6784b2081ec630ca33a53587.mockapi.io/products"; // Replace with your MockAPI endpoint

// DOM Elements
const productList = document.getElementById("product-list");
const createProductBtn = document.getElementById("create-product-btn");
const createProductForm = document.getElementById("create-product-form");

// Constructor
class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    render() {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${this.image}" alt="${this.title}">
            <h3>${this.title}</h3>
            <p>Price: $${this.price}</p>
            <p>${this.description}</p>
            <button onclick="updateProduct('${this.id}')">Update</button>
            <button onclick="deleteProduct('${this.id}')">Delete</button>
        `;
        productList.appendChild(card);
    }
}

// Fetch and Render Products (READ)
const fetchProducts = async () => {
    try {
        productList.innerHTML = ""; // Clear existing content
        const response = await fetch(API_URL);
        const data = await response.json();
        data.map(item => {
            const product = new Product(item.id, item.title, item.price, item.description, item.image);
            product.render();
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Toggle Form Visibility
createProductBtn.addEventListener("click", () => {
    createProductForm.style.display =
        createProductForm.style.display === "none" ? "block" : "none";
});

// Create a Product (CREATE)
createProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("product-title").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const description = document.getElementById("product-description").value;
    const image = document.getElementById("product-image").value;

    const newProduct = {
        title,
        price,
        description,
        image,
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });
        alert("Product created successfully!");
        createProductForm.reset();
        createProductForm.style.display = "none"; // Hide form after submission
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error creating product:", error);
    }
});

// Update Product (UPDATE)
const updateProduct = async (id) => {
    const newTitle = prompt("Enter the new title:");
    if (!newTitle) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTitle }),
        });
        alert("Product updated!");
        fetchProducts();
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

// Delete Product (DELETE)
const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        alert("Product deleted!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

// Initial Fetch
fetchProducts();