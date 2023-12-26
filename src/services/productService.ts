import slugify from 'slugify'

import { Product } from '../models/productSchema'
import { createHttpError } from '../util/createHTTPError'
import { ProductsInput, ProductsType } from '../types/productTypes'
import { deleteFromCloudinary, uploadToCloudinary, valueWithoutExtension } from '../helper/cloudinaryHelper'

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
    .sort({ name: 1 })
  return {
    products,
    totalPage,
    currentPage: page
  }
}
export const findFiltredProducts = async (page: number, limit: number, search: string, checkedCategory: string[]) =>
{
  const filter = {
    category :{}
  }
  if (checkedCategory && checkedCategory.length > 0) {
    filter.category = {$in: checkedCategory}
  }
  const count = await Product.countDocuments(filter)
 
  const totalPage = Math.ceil(count / limit)
 
  if (page > totalPage) {
    page = totalPage
  }
  
  const skip = (page - 1) * limit
  const products: ProductsType[] = await Product.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort({ price: 1 })
    .sort({ name: 1 })
  return {
    products,
    totalPage,
    currentPage: page
  }
}

export const findProductsBySlug = async (slug: string): Promise<ProductsInput> => {
  const product = await Product.findOne({ slug: slug })
  if (!product) {
    const error = createHttpError(404, 'product not found')
    throw error
  }
  return product
}

export const createProduct = async (product: ProductsInput, image: string ) => {
  const { title, price, category, description, quantity, sold, shipping } = product
  const productExist = await Product.exists({ title: title })
  if (productExist) {
    throw new Error('product already exist with this title')
  }
  const newProduct = new Product({
    title: title,
    slug: slugify(title),
    price: price,
    category: category,
    description: description,
    quantity: quantity,
    sold: sold,
    shipping: shipping,
  })

  if (image) {
    newProduct.image = image
  }
  const cloudinaryUrl = await uploadToCloudinary(image, 'productsimages')
  // adding the cloudinary url to
  newProduct.image = cloudinaryUrl

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

export const deleteProduct = async (slug: string) => {
  const productExist = await Product.findOne({ slug: slug })
  if (!productExist) {
    throw createHttpError(404, 'Product not found')
  }
  if (productExist && productExist.image) {
    const publicId = await valueWithoutExtension(productExist.image)
    await deleteFromCloudinary(`product_image/${publicId}`)
  }
  await Product.findOneAndDelete({ slug: slug })
}
