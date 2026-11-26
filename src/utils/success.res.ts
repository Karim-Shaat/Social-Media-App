import { NextFunction, Request, Response } from "express";


interface handlerType{
     data?: object; 
     status?: number; 
     msg?: string
}
export const successRes = (
  handler: ( req: Request, res: Response, next?: NextFunction,) 
    => Promise<handlerType> | handlerType,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { data = {}, msg = "Done", status = 200} = await handler(req, res, next);
    return res.status(status).json({
      msg,
      data,
      status,
      timeStamp: new Date(Date.now()),
    });
  };
};
