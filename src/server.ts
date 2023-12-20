import express, { Application } from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import { dev } from './config'
import { connectDB } from './config/db'
import { createHttpError } from './util/createHTTPError'

import myLogger from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'

import productRoutes from './routers/productRoutes'
import userRoutes from './routers/userRoutes'
import categoryRoutes from './routers/categoryRoutes'
import orderRoutes from './routers/orderRoutes'
import authRoutes from './routers/authRoutes'

config()

const app: Application = express()
const port: number = dev.app.port

app.use(cookieParser())
app.use(myLogger)
app.use(cors({
origin: "http://localhost:3000",
credentials:true, 
}))

app.use('/public', express.static('public'))
app.use(morgan('dev'))
// 

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

app.use(errorHandler)

app.use((req, res, next) => {
  const error = createHttpError(404, 'router not found')
  next(error)
})

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
  connectDB()
})
