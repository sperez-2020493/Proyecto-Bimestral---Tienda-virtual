import { Router } from "express"
import { crearProducto, editarProducto, listarProductos, eliminarProducto, listarProductosExploracion } from "./product.controller.js"
import { createdProductValidator, updateProductValidator, deleteProductValidator, listValidator, listValidatorUser } from "../middlewares/product-validators.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()


router.post("/agregarProducto", createdProductValidator, deleteFileOnError, crearProducto)

router.put("/editarProducto/:uid", updateProductValidator, deleteFileOnError, editarProducto)

router.delete("/eliminarProducto/:uid", deleteProductValidator, deleteFileOnError, eliminarProducto )

router.get("/productos/", listValidator, listarProductos);

router.get("/productosExploracion/", listValidatorUser, listarProductosExploracion);


export default router 