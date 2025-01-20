import mongoose, {Schema} from 'mongoose';

const subscriptionSchema = new Schema(
    {
       subscriber:{
        type: Schema.Types.ObjectId, //the one who is subscribing
        ref: 'User',
        required: true
       },
       channel:{
        type: Schema.Types.ObjectId, //the one who is getting subscribed
        ref: 'User',
        required: true
       } 
    }, { timestamps: true})


export const Subscription = mongoose.model('Subscription', subscriptionSchema)