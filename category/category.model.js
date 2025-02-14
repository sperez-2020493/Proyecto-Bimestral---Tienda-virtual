import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        maxLength: [50, "Category name cannot exceed 50 characters"]
    },
    
    description: {
        type: String,
        maxLength: [255, "Description cannot exceed 255 characters"]
    },
    
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Categoria = model("Categoria", categorySchema);
