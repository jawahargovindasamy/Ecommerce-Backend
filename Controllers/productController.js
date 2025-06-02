import Product from "../Models/productModel.js";

//Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while creating product",
      error: error.message,
    });
  }
};

//Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while fetching products",
      error: error.message,
    });
  }
};

//Update a product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, stock, image },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while updating product",
      error: error.message,
    });
  }
};

//Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while deleting product",
      error: error.message,
    });
  }
};
