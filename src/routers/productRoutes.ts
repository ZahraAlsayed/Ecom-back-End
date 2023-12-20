import { Router } from 'express'

import {
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
  createSingleProduct,
  updateSingleProduct,
} from '../controllers/productControllers'

import { createProductValidation, updateProductValidation } from '../validation/productValidation'
import { uploadProductimage } from '../middlewares/uploadFile'
import { runValidation } from '../validation/runValidation'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const productRoutes = Router()

// productRoutes.get('/', getAllProducts)
// productRoutes.get('/:slug', getSingleProduct)
// productRoutes.post(
//   '/',
//   isLoggedIn,
//   isAdmin,
//   uploadProductimage.single('image'),
//   createProductValidation,
//   runValidation,
//   createSingleProduct
// )
// productRoutes.put(
//   '/:slug',
//   isLoggedIn,
//   isAdmin,
//   uploadProductimage.single('image'),
//   updateProductValidation,
//   runValidation,
//   updateSingleProduct
// )
// productRoutes.delete('/:slug', isLoggedIn, isAdmin, deleteSingleProduct)
// export default productRoutes


productRoutes.get('/', getAllProducts)
productRoutes.get('/:slug', getSingleProduct)
productRoutes.post(
  '/',
  uploadProductimage.single('image'),
  // createProductValidation,
  // runValidation,
  createSingleProduct
)
productRoutes.put(
  '/:slug',
  uploadProductimage.single('image'),
  // updateProductValidation,
  // runValidation,
  updateSingleProduct
)
productRoutes.delete('/:slug',deleteSingleProduct)
export default productRoutes
