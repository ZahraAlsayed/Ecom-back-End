import { Router } from 'express'

import {
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
  createSingleProduct,
  updateSingleProduct,
  updateSingleProductByslug,
  getFiltereedProducts,
  generateBraintreeToken,
  handleBraintreePayment,
} from '../controllers/productControllers'

import { createProductValidation, updateProductValidation } from '../validation/productValidation'
import { uploadProductimage } from '../middlewares/uploadFile'
import { runValidation } from '../validation/runValidation'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const productRoutes = Router()

productRoutes.get('/', getAllProducts)
productRoutes.get('/:slug', getSingleProduct)
productRoutes.get('/filter-products', getFiltereedProducts)
productRoutes.get('/braintree/token',isLoggedIn, generateBraintreeToken)
productRoutes.post('/braintree/payment', isLoggedIn, handleBraintreePayment)
productRoutes.post(
  '/',
  isLoggedIn,
  isAdmin,
  uploadProductimage.single('image'),
  createProductValidation,
  runValidation,
  createSingleProduct
)
productRoutes.put(
  '/:slug',
  isLoggedIn,
  isAdmin,
  uploadProductimage.single('image'),
  updateProductValidation,
  runValidation,
  updateSingleProduct
)
productRoutes.delete('/:slug', isLoggedIn, isAdmin, deleteSingleProduct)

export default productRoutes
