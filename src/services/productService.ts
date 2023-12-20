import slugify from 'slugify'

import { Product } from '../models/productSchema'
import { createHttpError } from '../util/createHTTPError'
import { ProductsInput, ProductsType } from '../types/productTypes'

export const findAllProducts = async (page = 1, limit = 3, search = '') => {
  const count = await Product.countDocuments()
  const totalPage = Math.ceil(count / limit)
  const searchRegExp = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [{ title: { $regex: searchRegExp } }, { description: { $regex: searchRegExp } }],
    $and: [{ price: { $gt: 2000 } }, { price: { $lt: 3000 } }],
  }
  if (page > totalPage) {
    page = totalPage
  }

  const skip = (page - 1) * limit
  const products: ProductsType[] = await Product.find()
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort({ price: 1 })
  return { products, totalPage, currentPage: page }
}

export const findProductsBySlug = async (slug: string): Promise<ProductsInput> => {
  const product = await Product.findOne({ slug: slug })
  if (!product) {
    const error = createHttpError(404, 'product not found')
    throw error
  }
  return product
}

export const createProduct = async (product: ProductsInput, image: string | undefined) => {
  const { title } = product
  const productExist = await Product.exists({ title: title })
  if (productExist) {
    throw new Error('product already exist with this title')
  }
  const newProduct = new Product({
    title: product.title,
    slug: slugify(title),
    image: image,
    price: product.price,
    category: product.category,
    description: product.description,
    quantity: product.quantity,
    sold: product.sold,
    shipping: product.shipping,
  })
  await newProduct.save()
  return newProduct
}

export const updateProduct = async (
  slug: string,
  updatedProductData: ProductsInput,
  image: string | undefined
): Promise<ProductsInput> => {
  if (updatedProductData.title) {
    updatedProductData.slug = slugify(updatedProductData.title)
  }

  if (image) {
    updatedProductData.image = image
  }

  const updatedproduct = await Product.findOneAndUpdate({ slug: slug }, updatedProductData, {
    new: true,
  })

  if (!updatedproduct) {
    const error = createHttpError(404, 'Product not found')
    throw error
  }
  return updatedproduct
}

export const deleteProduct = async (slug: string): Promise<ProductsInput> => {
  const product = await Product.findOneAndDelete({ slug: slug })
  if (!product) {
    const error = createHttpError(404, 'product not found')
    throw error
  }
  return product
}
