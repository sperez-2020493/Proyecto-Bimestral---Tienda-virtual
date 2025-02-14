import { Router } from "express";
import { register, modificarUsuarios, eliminarUsuario } from "./user.controller.js";
import { registerValidatorPriv, modificarUsuariosValidator, eliminarUserValidation } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.post(
  "/registerPriv",
  uploadProfilePicture.single("profilePicture"),
  registerValidatorPriv,
  register
);

router.put("/modificClient/:uid", modificarUsuariosValidator , modificarUsuarios);

router.patch("/modificAdmin/:uid", modificarUsuariosValidator , modificarUsuarios);

router.delete("/eliminarUser/:uid", eliminarUserValidation, eliminarUsuario);

export default router;