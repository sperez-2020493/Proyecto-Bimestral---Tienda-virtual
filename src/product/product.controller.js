import  Producto  from "./product.model.js"; 
import  Category  from "../category/category.model.js";

export const crearProducto = async (req, res) => {
    try {
        const data = req.body;

        const existProduct = await Producto.findOne({ nameProduct: data.nameProduct });
        if (existProduct) {
            return res.status(400).json({
                success: false,
                msg: "Ya existe un producto con este nombre",
            });
        }

        const existCategory = await Category.findById(data.category);
        if (!existCategory) {
            return res.status(400).json({
                success: false,
                msg: "La categoría especificada no existe",
            });
        }

        const producto = new Producto(data);
        await producto.save();

        return res.status(200).json({
            success: true,
            msg: `Producto '${data.nameProduct}' creado exitosamente`,
            producto,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear el producto",
            error,
        });
    }
};

export const editarProducto = async (req, res) => {
    try {
        const { uid } = req.params; 
        const updates = req.body; 
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const updatedProduct = await Producto.findByIdAndUpdate(uid, { $set: updates }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Producto actualizado correctamente",
            product: updatedProduct,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error: err.message,
        });
    }
};

export const listarProductos = async (req, res) => {
    try {
        const { category, nameProduct, status, masVendidos, mostrarCategorias } = req.query; 

        if (mostrarCategorias === "true") {
            const categorias = await Category.find({}, "nameCategory");
            return res.status(200).json({
                success: true,
                message: "Listado de categorías",
                categorias,
            });
        }

        const filtro = {};
        if (category) {
            filtro.category = category;
        }
        if (nameProduct) {
            filtro.nameProduct = { $regex: nameProduct, $options: "i" };
        }
        if (status) {
            filtro.status = status;
        }

        let sortOptions = {};
        if (masVendidos === "true") {
            sortOptions.sales = -1; 
        }

        const productos = await Producto.find(filtro)
            .sort(sortOptions)
            .populate("category", "nameCategory");

        return res.status(200).json({
            success: true,
            message: "Listado de productos",
            productos
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al listar los productos",
            error: error.message,
        });
    }
};


export const listarProductosExploracion = async (req, res) => {
    try {
        const { nameProduct, category, masVendidos, mostrarCategorias } = req.query;

        if (mostrarCategorias === "true") {
            const categorias = await Category.find({}, "nameCategory");
            return res.status(200).json({
                success: true,
                message: "Listado de categorías",
                categorias,
            });
        }

        const filtro = {};
        if (nameProduct) {
            filtro.nameProduct = { $regex: nameProduct, $options: "i" }; 
        }
        if (category) {
            filtro.category = category; 
        }

        let sortOptions = {};
        if (masVendidos === "true") {
            sortOptions.sales = -1; 
        }

        const productos = await Producto.find(filtro)
            .sort(sortOptions)
            .populate("category", "nameCategory")
            .select("-buyer");

        return res.status(200).json({
            success: true,
            message: "Exploración de productos",
            productos, 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al explorar los productos",
            error: error.message,
        });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { uid } = req.params;

        const producto = await Producto.findById(uid);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }
        await Producto.findByIdAndDelete(uid);

        return res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: err.message
        });
    }
};