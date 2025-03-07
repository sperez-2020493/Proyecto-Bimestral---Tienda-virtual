import { Router } from "express";
import { register, modificarUsuarios, eliminarUsuario, eliminarUsuarioPublic } from "./user.controller.js";
import { registerValidatorPriv, modificarUsuariosValidator, eliminarUserPrivValidation, eliminarUserValidation } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.post(
  "/registerPriv",
  uploadProfilePicture.single("profilePicture"),
  registerValidatorPriv,
  register
);

router.put("/editUser/:uid", modificarUsuariosValidator , modificarUsuarios);

router.delete("/eliminarUser/:uid", eliminarUserPrivValidation, eliminarUsuario);

router.delete("/eliminarUserPublic/:uid", eliminarUserValidation, eliminarUsuarioPublic);


export default router;