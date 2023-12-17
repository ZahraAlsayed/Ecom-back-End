import bcrypt from 'bcrypt'

import { JwtPayload } from 'jsonwebtoken'

import {User} from '../models/userSchema'
import { dev } from '../config'
import { IUsers, UserType, UsersInput } from '../types/userTypes'

import { handleSendEmail } from '../helper/sendEmail'
import { createHttpError } from '../util/createHTTPError'
import { generateJwtToken, verifyJwtToken } from '../util/jwtTokenHelper'



export const processRegisterUserService = async (
  name: string,
  email: string,
  password: string,
  address: string,
  phone: string,
  imagePath: string | undefined,
  isAdmin: boolean
) => {
  const isUserExists = await User.exists({ email })

  if (isUserExists) {
    throw createHttpError(409, 'User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const tokenPayload: UserType = {
    name: name,
    email: email,
    password: hashedPassword,
    address: address,
    phone: phone,
    isAdmin: isAdmin,
  }

  if (imagePath) {
    tokenPayload.image = imagePath
  }

  const token = generateJwtToken(tokenPayload, String(dev.app.jwtUserActivationKey), '15m')

  //send email hear => token inside the email
  const emailData = {
    email: email,
    subjeect: 'Activate Your Account',
    html: `<h1>Hello ${name}</h1>
      <p>Please activate your account by : <a href="http://localhost:3000/users/activate/${token}">click the following link</a></p>`,
  }
  //send email
  await handleSendEmail(emailData)
  
}

export const activeUser = async (token: '') => {
  if (!token) {
    throw createHttpError(400, 'please Provide a token')
  }

  const decoded = verifyJwtToken(token, String(dev.app.jwtUserActivationKey))

  if (!decoded) {
    throw createHttpError(401, 'Token is Invalid ')
  }
  const useractive = await User.create(decoded)

  return useractive
}

export const findAllUsers = async (page = 1, limit = 3, search = '') => {
  const count = await User.countDocuments()
  const totalPage = Math.ceil(count / limit)

  let filter = {}
  if (search) {
    const searchRegExp = new RegExp('.*' + search + '.*', 'i')

    filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    }
  }
  const options = { password: 0, __v: 0 }

  if (page > totalPage) {
    page = totalPage
  }

  const skip = (page - 1) * limit
  const users: IUsers[] = await User.find(filter, options)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1, name: 1 })
  return { users, totalPage, currentPage: page }
}

export const findUserById = async (id: string): Promise<IUsers> => {
  const options = { password: 0, __v: 0 }
  const user = await User.findById(id, options)
  if (!user) {
    //create http error //status 404
    const error = createHttpError(404, 'User not found')
    throw error
  }
  return user
}

export const updateUser = async (
  id: string,
  updatedUserData: UsersInput,
  image: string | undefined
): Promise<UsersInput> => {
  if (updatedUserData.id) {
    updatedUserData.id = updatedUserData.id
  }

  if (image) {
    updatedUserData.image = image
  }

  const updateduser = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  })

  if (!updateduser) {
    const error = createHttpError(404, 'User not found')
    throw error
  }
  return updateduser
}

export const updateBanStatusById = async (id: string, isBanned: boolean) => {
  const user = await User.findByIdAndUpdate(id, { isBanned }, { new: true })

  if (!user) {
    //create http error ,status 404
    const error = createHttpError(404, 'User not found')
    throw error
  }
}

export const deleteUser = async (id: string): Promise<UsersInput> => {
  const user = await User.findByIdAndDelete(id)
  if (!user) {
    const error = createHttpError(404, 'User not found')
    throw error
  }
  return user
}

export const forgetPasswordAction = async (email: string): Promise<string> => {
  const user = await User.findOne({ email })
  if (!user) {
    //create http error ,status 404
    const error = createHttpError(404, 'User not found')
    throw error
  }
  const token = generateJwtToken({ email: email }, String(dev.app.jwtResetPasswordKey), '10m')
  const emailData = {
    email: email,
    subjeect: 'Rest Password Email',
    html: `<h1>Hello ${user.name}</h1>
      <p>Please Click here to  : <a href="http://localhost:5050/users/rest-password/${token}"> rest  your password</a></p>`,
  }
  //send email
  await handleSendEmail(emailData)
  return token
}

export const resstPasswordAction = async (token: '', password: string) => {
  const decoded = verifyJwtToken(token, String(dev.app.jwtResetPasswordKey)) as JwtPayload

  const hashedPassword = await bcrypt.hash(password, 10)

  if (!token) {
    throw createHttpError(401, 'Plase Enter Valid Token ')
  }
  // Check if the decoded value is falsy
  if (!decoded) {
    throw createHttpError(401, 'Token is Invalid ')
  }
  // Update the user's password in the database
  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { $set: { password: hashedPassword } },
    { new: true }
  )
  // Check if the user was not found
  if (!user) {
    throw createHttpError(401, 'The password reset was unsuccessfully  ')
  }
  // Return the updated user
  return user
}
