import { Router } from "express";
import { signUp } from "./user.services.js";
const router = Router();
export const routes = {
    base: "/users",
    signUp: "/signup", //post
};
router.post(routes.signUp, async (req, res) => {
    const { body } = req;
    const { data } = await signUp(body);
    res.json({
        msg: "done"
    });
});
export default router;
