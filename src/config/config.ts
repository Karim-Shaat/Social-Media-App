export const PORT = process.env.PORT;

export const MONGO_URI = process.env.MONGO_URI as string;
export const REDIS_URI = process.env.REDIS_URI as string;

export const USER = process.env.USER as string;
export const PASSWORD = process.env.PASSWORD as string;

export const AccessToken = process.env.ACCESS_TOKEN_SECRET as string
export const RefreshToken = process.env.REFRESH_TOKEN_SECRET as string