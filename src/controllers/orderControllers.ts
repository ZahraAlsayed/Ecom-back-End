import { NextFunction, Request, Response } from 'express'
import { Order } from '../models/orderSchema'
import { OrdersInput } from '../types'
import { createOrder, deleteOrderById, findAllOrders, findOrderById, updateOrderById } from '../services/orderService'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const { orders, totalPage, currentPage } = await findAllOrders(page, limit)
    res.send({
      message: 'return all orders',
      payload: {
        orders,
        totalPage,
        currentPage: page,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const createSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderData = req.body
    const newOrder = await createOrder(orderData)
    res.status(201).send({
      message: 'The order has been created successfully',
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}


export const getSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      console.log(id)
      const category = await findOrderById(id)
      res.status(200).json({
        massege: 'return single Order',
        payload: category,
      })
    } catch (error) {
      next(error)
    }
  }

  export const updateSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const updatedOrder: OrdersInput = req.body
      const order = await updateOrderById(id, updatedOrder)
      res.status(200).json({
        massege: 'The Order has been updated successfully',
        payload: order,
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
