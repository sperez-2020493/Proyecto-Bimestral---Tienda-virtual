import { body,param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";


export const createdProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("nameProduct").notEmpty().withMessage("El nombre del producto es requerido"),
    body("description").notEmpty().withMessage("La descripcion de la categoria es requerida"),
    body("category").notEmpty().withMessage("La categoria es requerida"),
    body("price").notEmpty().withMessage("El precio del producto es requerida"),
    body("quantity").notEmpty().withMessage("La cantidad de producto es requerida"),
    validarCampos,
    handleErrors
];

export const updateProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId(),
    validarCampos,
]

export const deleteProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId(),
    validarCampos,
]

export const listValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),    
    validarCampos,
    handleErrors
]