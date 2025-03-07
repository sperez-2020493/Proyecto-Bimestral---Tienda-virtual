import { body,param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";


export const createdFactureValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE" ),
    body("quantity").notEmpty().withMessage("La cantidad del producto es requerida"),
    validarCampos,
    handleErrors
];

export const listFacturaValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE"),
    validarCampos,
]

export const listFacturaPrivValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validarCampos,
]