import "dotenv/config";

export const dev = {
  app: {
    port: Number(process.env.PORT) ,
    defaultImagePath: process.env.DEFAULT_IMAGE_PATH ,
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY ,
    jwtResetPasswordKey: process.env.JWT_REST_PASSWORD_KEY ,
    jwtAccessKey: process.env.JWT_ACCESS_KEY ,
    stmpUsername: process.env.STMP_USERNAME ,
    stmpPassword: process.env.STMP_PASSWORD ,
  },
  db: {
    url: String(process.env.MONGODB_URL) ,
  },
  // cloud: {
  //   cloudinaryName:process.env.CLOUDINARY_NAME,
  //   cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
  //   cloudinarySecretKey:process.env.CLOUDINARY_SECRET_KEY,
  // },
}
