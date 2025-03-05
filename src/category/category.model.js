import { Schema, model} from "mongoose";

const categorySchema = Schema({
    nameCategory:{
        type: String,
        required: [true, "Name category is required"],
        maxLength: [25, "Name category cannot exceed 35 characters"],
        unique: true
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        maxLength: [255, "Description cannot exceed 255 characters"]
    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})

export default model("Category", categorySchema)
