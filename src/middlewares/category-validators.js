import { body,param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";


export const createdCategoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("nameCategory").notEmpty().withMessage("El nombre de la categoria es requerido"),
    body("description").notEmpty().withMessage("La descripcion de la categoria es requerida"),
    validarCampos,
    handleErrors
];

export const updateCategoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId(),
    validarCampos,
]

export const deleteCategoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId(),
    validarCampos,
]