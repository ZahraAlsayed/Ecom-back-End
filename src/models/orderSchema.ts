import mongoose, { Schema, model } from 'mongoose'
import { OrdersType } from '../types/orderTypes'

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
        // product: {
        //   type: Schema.Types.ObjectId,
        //   ref: 'products',
        //   required: true,
        // },
        // quantity: { type: Number, required: true },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    payment: { type: Object, required: true },
    status: {
      type: String,
      enum: ['Not Proccess', 'Proccessing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Not Proccess',
    },
  },
  { timestamps: true }
)

export const Order = model<OrdersType>('orders', orderSchema)