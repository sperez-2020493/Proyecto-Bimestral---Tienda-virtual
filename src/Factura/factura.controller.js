import PDFDocument from 'pdfkit';
import fs from 'fs';
import jwt from 'jsonwebtoken';
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
                return res.status(400).json({ message: "Stock insuficiente para el producto " + (product.nameProduct || "desconocido") });
            }

            product.quantity -= quantity;
            await product.save();

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
            totalCompra
        });
        await factura.save();

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
        doc.fontSize(10).text('Dirección de la tienda, Teléfono, Email', { align: 'center' });
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

        res.status(200).json({
            message: "Factura generada con éxito",
            factura: factura,
            facturaPdfPath: facturaPath
        });

    } catch (error) {
        return res.status(500).json({ message: "Error al generar la factura", error: error.message });
    }
};