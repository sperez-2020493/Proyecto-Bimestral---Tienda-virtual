import { Schema, model } from "mongoose";

const facturaSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productos: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },
        
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    totalCompra: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default model("Factura", facturaSchema);