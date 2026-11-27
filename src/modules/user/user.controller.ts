import { Router } from "express";
import { UserServices } from "./user.services";
import { successRes } from "../../utils/success.res";
import { auth } from "../../middlewares/auth.middleware";
import { StorageTypeEnum, uploadFile } from "../../utils/multer/upload.file";
import { badRequestException } from "../../utils/error.handle";
import { HUser } from "./user.types";

const router = Router();
export const routes = {
  base: "/users",
  signUp: "/signup", //post
  logIn: "/login", //POSt
  profile: "/me", //GET
  profileImage: "/profile-image" //PATCH
};

router.post(routes.signUp, successRes( async (req, res) => {
  const { body } = req;
  const { data } = await UserServices.signUpService(body);
  return{
    data,
  }
}));

router.post(routes.logIn,successRes( async(req, res) =>{
  const {identifier, password} =req.body
  const {data } = await UserServices.loginService({identifier, password}) 

  return{
    data
  }
}))

router.get(routes.profile, auth, successRes( async (req, res)=>{
  const { user, jti } = req
  return{
    data: user as Object
  }
}))

router.patch(
  routes.profileImage,
  auth,
  uploadFile({ storageType: StorageTypeEnum.memory }).single("image"),
  successRes(async (req) => {
    if (!req.file) {
      throw new badRequestException("file is required");
    }
    const { data } = await UserServices.updateProfileImageService({user: req.user as HUser, file: req.file});
    return { data };
  }),
);


export default router;
