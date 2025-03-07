import { Router } from "express"
import {generarFactura } from "./factura.controller.js"
import {  } from "../middlewares/category-validators.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()


router.post("/FacturaGenerar", deleteFileOnError, generarFactura)


export default router