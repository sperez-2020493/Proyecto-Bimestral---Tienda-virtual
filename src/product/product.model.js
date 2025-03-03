import { Schema, model } from "mongoose";

const productoSchema = Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    
    description: {
        type: String,
        maxLength: [255, "Description cannot exceed 255 characters"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"]
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "Category is required"]
    },
    
    purchasedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Purchaser is required"]
    },
    
    status: {
        type: String,
        enum: ['AGOTADO', 'DESCONTINUADO'],
        default: 'DISPONIBLE',
        required: true,
    },

}, {
    versionKey: false,
    timestamps: true
});

export const Producto = model("Producto", productoSchema);
