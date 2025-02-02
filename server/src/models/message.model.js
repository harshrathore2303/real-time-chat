import mongoose, {Schema, model} from "mongoose"

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }, 
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type:String
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Message = model("Message", messageSchema);