import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const ProductsStorge = multer.diskStorage({
  destination: function (req : Request, file :Express.Multer.File, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const userStorge = multer.diskStorage({
  // destination: function (req : Request, file :Express.Multer.File, cb) {
  //   cb(null, 'public/images/users')
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb : FileFilterCallback) => {
  const allowedType = ['image/jpeg', 'image/png', 'image/jpg']
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error('file type is not image'))
  }
  if (!allowedType.includes(file.mimetype)) {
    return cb(new Error('Only images are allowed'))
  }
   cb(null, true)
}


export const uploadProductimage = multer({ storage: ProductsStorge ,limits:{fileSize: 1024 * 1024 *1}, fileFilter: fileFilter})
export const uploadUsersimage = multer({
  storage: userStorge,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: fileFilter,
})
