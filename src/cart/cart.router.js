import { Router } from "express"
import { agregarProduct, modificarCantidadCarrito, eliminarProductoCarrito, eliminarCarrito } from "./cart.controller.js"
import { newProductvalidator, modificarCarritoValidator, eliminarProductoCarritoValidator, eliminarCarritoValidation } from "../middlewares/cart-validators.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()

router.post("/agregarCarrito", newProductvalidator, deleteFileOnError, agregarProduct)
router.put("/editarCarrito", modificarCarritoValidator, deleteFileOnError, modificarCantidadCarrito)
router.delete("/eliminarProducto", eliminarProductoCarritoValidator, deleteFileOnError, eliminarProductoCarrito)
router.delete("/eliminarCarrito", eliminarCarritoValidation, deleteFileOnError, eliminarCarrito)

export default router