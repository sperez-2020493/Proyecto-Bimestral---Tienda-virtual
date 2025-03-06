import { Schema, model } from "mongoose";

const productoSchema = new Schema({
    nameProduct: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    
    description: {
        type: String,
        maxLength: [255, "Description cannot exceed 255 characters"]
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"]
    },

    sales: {
        type: Number,
        min: [0, "Quantity cannot be negative"],
        default: 0,
        required: false
    },
    
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: false,
    },
    
    status: {
        type: String,
        String: ['AGOTADO', 'DESCONTINUADO'],
        default: 'DISPONIBLE',
        required: false,
    },

}, {
    versionKey: false,
    timestamps: true
});

export default model ("Producto", productoSchema);
