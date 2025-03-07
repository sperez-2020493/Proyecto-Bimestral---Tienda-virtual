import { Router } from "express"
import {generarFactura, getHistorial, getHistorialAdmin } from "./factura.controller.js"
import { createdFactureValidator, listFacturaValidator, listFacturaPrivValidator } from "../middlewares/factura-validators.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()


router.post("/FacturaGenerar", createdFactureValidator,deleteFileOnError, generarFactura)

router.get("/Historial", listFacturaValidator ,deleteFileOnError, getHistorial)
router.get("/HistorialPriv/", listFacturaPrivValidator,deleteFileOnError, getHistorialAdmin)


export default router