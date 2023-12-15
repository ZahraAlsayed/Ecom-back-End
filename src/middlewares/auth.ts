import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { createHttpError } from '../util/createHTTPError'
import { dev } from '../config'
import {User} from '../models/userSchema'
import { verifyJwtToken } from '../util/jwtTokenHelper'

interface CustomRequest extends Request {
  userId?: string
}
export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) {
      const error = createHttpError(404, 'You are not logged in')
      throw error
    }
    const decoded = (verifyJwtToken(accessToken, String(dev.app.jwtAccessKey))) as JwtPayload
    if (!decoded) {
      const error = createHttpError(404, 'Invalid access token')
      throw error
    }
    req.userId = decoded._id
    next()
  } catch (error) {
    next(error)
  }
}

export const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (accessToken) {
      const error = createHttpError(404, 'You are already logged in')
      throw error
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)
    if (user?.isAdmin) {
      next()
    } else {
      throw createHttpError(403, 'You are not an admin. You do not have access to this route')
    }
  } catch (error) {
    next(error)
  }
}
