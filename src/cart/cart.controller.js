import Cart from "./cart.model.js";
import jwt from "jsonwebtoken";
import Producto from "../product/product.model.js";

export const agregarProduct = async (req, res) => {
    try {
        const token = req.header("Authorization");
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const { productId, quantity } = req.body;

        const product = await Producto.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product.status === "DESCONTINUADO" || product.status === "AGOTADO") {
            return res.status(400).json({ message: `El producto ${product.nameProduct} no está disponible para la compra` });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: "Stock insuficiente para este producto" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        if (product.quantity === 0 && product.status !== "AGOTADO") {
            product.status = "AGOTADO";
            await product.save(); 
        }

        await cart.save();  

        res.status(200).json({ message: "Producto agregado al carrito con éxito", cart });

    } catch (error) {
        return res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
};


export const modificarCantidadCarrito = async (req, res) => {
    try {
        const token = req.header("Authorization");
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const { productId, nuevaCantidad } = req.body;

        if (nuevaCantidad <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor que 0" });
        }

        const productExists = await Producto.findById(productId);

        if (productExists.quantity < nuevaCantidad) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(producto => producto.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        cart.products[productIndex].quantity = nuevaCantidad;

        await cart.save();
        res.status(200).json({ message: "Cantidad actualizada en el carrito", cart });

    } catch (error) {
        return res.status(500).json({ message: "Error al modificar la cantidad", error: error.message });
    }
};

export const eliminarProductoCarrito = async (req, res) => {
    try {
        const token = req.header("Authorization");
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const { productId } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(producto => producto.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        cart.products.splice(productIndex, 1);

        await cart.save();
        res.status(200).json({ message: "Producto eliminado del carrito", cart });

    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
};

export const eliminarCarrito = async (req, res) => {
    try {
        const token = req.header("Authorization");
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        await Cart.deleteOne({ user: userId });

        res.status(200).json({ message: "Carrito eliminado con éxito" });

    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el carrito", error: error.message });
    }
};