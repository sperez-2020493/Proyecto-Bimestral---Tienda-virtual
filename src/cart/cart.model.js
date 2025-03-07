import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity cannot be less than 1"],
            default: 1
        }
    }]
}, {
    versionKey: false,
    timestamps: true
});

export default model("Cart", cartSchema);