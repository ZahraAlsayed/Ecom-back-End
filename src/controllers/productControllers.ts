import { NextFunction, Request, Response } from 'express'

import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductsBySlug,
  updateProduct,
} from '../services/productService'
import { deleteImage } from '../helper/deleteImageHelper'
import { ProductsInput } from '../types/productTypes'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) 
    const limit = Number(req.query.limit) 
    const search = req.query.search as string
    const { products, totalPage, currentPage } = await findAllProducts(page, limit, search)
    res.send({
      message: 'return all products',
      payload: {
        products,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await findProductsBySlug(req.params.slug)
    res.send({
      message: 'return single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    const imge = file?.path
    const productData = req.body
    const newProduct = await createProduct(productData, imge)
    res.status(201).send({
      message: ' The Product has been created successfully',
      payload: newProduct,
    })
  } catch (error) {
    next(error)
  }
}

export const updateSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const updateProductData: ProductsInput = req.body
    const file = req.file
    const imge = file?.path

    const updatedProduct = await updateProduct(slug, updateProductData, imge)
    res.status(200).send({
      message: 'The Product has been updated successfully',
      payload: updatedProduct,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await deleteProduct(req.params.slug)
    if (product && product.image) {
      await deleteImage(product.image)
    }
    res.send({
      message: ' The product has been deleted successfully ',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
