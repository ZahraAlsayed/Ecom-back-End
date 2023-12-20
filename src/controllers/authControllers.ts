import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/userSchema'
import { createHttpError } from '../util/createHTTPError'
import { generateJwtToken } from '../util/jwtTokenHelper'
import { dev } from '../config'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = createHttpError(404, 'User not found with this email')
      throw error
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      const error = createHttpError(404, 'Password did not match')
      throw error
    }
    if (user.isBanned) {
      const error = createHttpError(404, 'You are banned. Please contact the authority')
      throw error
    }
   const accessToken = generateJwtToken({ _id: user._id }, String(dev.app.jwtAccessKey), '7m')
    res.cookie('access_token', accessToken, {
      maxAge: 15 * 60 * 1000, // 15 mintues
      httpOnly: true, // prevent from store in browser
      sameSite: 'none',// can be different port
      secure: true, //
    })
    res.status(200).send({
      message: 'user is logged in',
      payload: user
    })
  } catch (error) {
    next(error)
  }
}


export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.status(200).send({
      message: 'user is logged out',
    })
  } catch (error) {
    next(error)
  }
}
