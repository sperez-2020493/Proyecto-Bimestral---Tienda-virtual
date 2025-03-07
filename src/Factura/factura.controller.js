import PDFDocument from 'pdfkit';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';
import Producto from '../product/product.model.js';
import Factura from '../Factura/factura.model.js'; 
import Cart from '../cart/cart.model.js';
import path from 'path';


export const generarFactura = async (req, res) => {
    try {
        const token = req.header("Authorization");
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const cart = await Cart.findOne({ user: userId }).populate("products.product"); 
        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: "No hay productos en el carrito" });
        }

        let totalCompra = 0;
        const productosFactura = [];
        let stockInsuficiente = false;

        if (!cart.products.every(item => item.product && item.product.nameProduct)) {
            return res.status(400).json({ message: "No todos los productos tienen la información completa" });
        }

        for (let item of cart.products) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({ message: "Producto no encontrado" });
            }

            const quantity = item.quantity;
            const total = product.price * quantity;

            if (product.quantity < quantity) {
                stockInsuficiente = true;
                continue;
            }

            productosFactura.push({
                product: product._id,
                nameProduct: product.nameProduct,
                quantity,
                price: product.price,
                total
            });

            totalCompra += total;
        }

        const factura = new Factura({
            user: userId,
            productos: productosFactura,
            totalCompra,
            status: stockInsuficiente ? "PROCESO" : "GENERADO"
        });
        await factura.save();

        if (stockInsuficiente) {
            return res.status(400).json({
                message: "Stock insuficiente para algunos productos, factura en PROCESO",
                factura
            });
        }

        for (let item of productosFactura) {
            const product = await Producto.findById(item.product);
            if (product) {
                product.quantity -= item.quantity;
                product.sales += item.quantity;
                if (product.quantity === 0) {
                    product.status = "AGOTADO";
                }
                await product.save();
            }
        }

        cart.products = [];
        await cart.save();

        await factura.populate({
            path: 'user',
            select: 'name' 
        });

        const facturaDir = path.resolve('public', 'Facturas');
        if (!fs.existsSync(facturaDir)) {
            fs.mkdirSync(facturaDir, { recursive: true });
        }

        const facturaPath = path.join(facturaDir, `factura_${factura._id}.pdf`);

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(facturaPath));

        doc.fontSize(16).text('Tienda Virtual', { align: 'center' });
        doc.fontSize(10).text('6A Avenida 13-54, Cdad. de Guatemala 01007, 2216 0000, infoets@kinal.org.gt', { align: 'center' });
        doc.moveDown(1);
        doc.text('-------------------------------------------', { align: 'center' });

        doc.moveDown(1);
        doc.fontSize(12).text(`Factura No: ${factura._id}`);
        doc.text(`Fecha: ${new Date().toLocaleString()}`);
        doc.text(`Usuario: ${factura.user.name}`);  
        doc.text('-------------------------------------------');

        doc.moveDown(1);
        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);

        doc.text('Producto            | Cantidad | Precio | Total', { align: 'left' });
        doc.text('--------------------------------------------------', { align: 'left' });

        productosFactura.forEach(item => {
            const productName = item.nameProduct || "Nombre no disponible"; 
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const total = item.total || 0;

            doc.text(`${productName.padEnd(20)} | ${quantity.toString().padStart(8)} | $${price.toFixed(2).padStart(6)} | $${total.toFixed(2).padStart(6)}`, { align: 'left' });
        });

        doc.moveDown(1);
        doc.text('-------------------------------------------', { align: 'left' });
        doc.fontSize(12).text(`Total: $${totalCompra.toFixed(2)}`, { align: 'right' });

        doc.moveDown(2);
        doc.text('Gracias por su compra!', { align: 'center' });

        doc.end();

        factura.facturaPdfPath = facturaPath;
        await factura.save();

        res.status(200).json({
            message: "Factura generada con éxito",
            factura: factura,
            facturaPdfPath: facturaPath
        });

    } catch (error) {
        return res.status(500).json({ message: "Error al generar la factura", error: error.message });
    }
};



export const getHistorial = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const facturas = await Factura.find({ user: userId }).populate({
            path: 'productos.product',  
            select: 'nameProduct'  
        });

        const historial = facturas.map(factura => ({
            facturaId: factura._id,
            fecha: factura.fecha,
            totalCompra: factura.totalCompra,
            productos: factura.productos.map(item => ({
                nombre: item.product.nameProduct,
                cantidad: item.quantity,
                precio: item.price,
                total: item.total
            }))
        }));

        return res.status(200).json({ historial });

    } catch (error) {
        console.error('Error al obtener el historial de compras:', error.message);
        res.status(500).json({ error: 'Error al obtener el historial de compras' });
    }
};

export const getHistorialAdmin = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const facturas = await Factura.find().populate({
            path: 'productos.product',
            select: 'nameProduct'
        });

        const historial = facturas.map(factura => ({
            facturaId: factura._id,
            fecha: factura.fecha,
            totalCompra: factura.totalCompra,
            productos: factura.productos.map(item => ({
                nombre: item.product.nameProduct,
                cantidad: item.quantity,
                precio: item.price,
                total: item.total
            }))
        }));

        return res.status(200).json({
            historial
        });

    } catch (error) {
        console.error('Error al obtener el historial de compras:', error.message);
        res.status(500).json({ error: 'Error al obtener el historial de compras' });
    }
};