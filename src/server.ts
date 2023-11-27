import express, { Application } from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit';

import { dev } from './config'
import { connectDB } from './config/db'
import { createHttpError } from './util/createHTTPError'

import myLogger from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'

import productRoutes from './routers/productRoutes'
import userRoutes from './routers/userRoutes'
import categoryRoutes from './routers/categoryRoutes'
import orderRoutes from './routers/orderRoutes'
import authRoutes from './routers/authRoutes';

config()

const app: Application = express()
const port: number = dev.app.port

app.use(myLogger)
app.use(cors())
app.use(morgan('dev'))
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
    message: "to many requst in 1 min"
})
app.use(limiter)
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
