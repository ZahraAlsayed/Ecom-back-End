// import bcrypt from 'bcrypt'

// import { User } from '../models/userSchema'
// import { createHttpError } from '../util/createHTTPError'
// import { generateJwtToken } from '../util/jwtTokenHelper'
// import { dev } from '../config'

// export const handleLoginService = async (email: string, password: string) => {
//   const user = await User.findOne({ email: email })
//   if (!user) {
//     const error = createHttpError(404, 'User not found with this email')
//     throw error
//   }
//   const isPasswordMatch = await bcrypt.compare(password, user.password)
//   if (!isPasswordMatch) {
//     const error = createHttpError(404, 'Password did not match')
//     throw error
//   }
//   if (user.isBanned) {
//     const error = createHttpError(404, 'You are banned. Please contact the authority')
//     throw error
//   }
//   const accessToken = generateJwtToken({ _id: user._id }, String(dev.app.jwtAccessKey), '7m')
//   return { accessToken }
// }
