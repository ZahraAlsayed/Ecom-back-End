import { NextFunction, Request, Response } from 'express'

import {
  deleteOrderById,
  findAllOrders,
  placeOrder,
  findAllOrdersForAdmin,
} from '../services/orderService'
import { OrdersType } from '../types/orderTypes'

interface CustomRequest extends Request {
  userId?: string
}

export const handleProcessPayment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = String(req.userId)
    const { cartItems, payment } = req.body
    const newOrder: OrdersType = await placeOrder(cartItems, payment, userId)
    res.send({
      message: 'payment was successful and order was created',
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllOrdersForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const userId = req.params.id
    const { orders, totalPage, currentPage } = await findAllOrders(page, limit, userId)
    res.send({
      message: 'return all orders for the user',
      payload: {
        orders,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllOrdersForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const { orders, totalPage, currentPage } = await findAllOrdersForAdmin(page, limit)
    res.send({
      message: 'return all orders for the admin',
      payload: {
        orders,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    await deleteOrderById(id)
    res.status(200).json({
      massege: 'The Order has been deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}