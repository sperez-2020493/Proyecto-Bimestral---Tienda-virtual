import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";


export const newProductvalidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE" ),
    body("quantity").notEmpty().withMessage("La cantidad es requerido"),
    validarCampos,
    handleErrors
];

export const modificarCarritoValidator = [
    validateJWT,              
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE" ), 
    body("nuevaCantidad").notEmpty().withMessage("La nueva cantidad es requerido"),
    validarCampos,
    handleErrors
];

export const eliminarProductoCarritoValidator = [
    validateJWT,              
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE" ), 
    body("productId").notEmpty().withMessage("La nueva cantidad es requerido"),
    validarCampos,
    handleErrors
];

export const eliminarCarritoValidation = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENTE_ROLE"),
    validarCampos,
    handleErrors
]