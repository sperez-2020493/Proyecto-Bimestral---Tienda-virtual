import { Router } from "express"
import { crearCategoria ,editarCategorias, eliminarCategorias} from "./category.controller.js"
import { createdCategoryValidator, updateCategoryValidator, deleteCategoryValidator } from "../middlewares/category-validators.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()


router.post("/agregarCategoria", createdCategoryValidator, deleteFileOnError, crearCategoria)

router.put("/editarCategoria/:uid", updateCategoryValidator, deleteFileOnError, editarCategorias)

router.delete("/eliminarCategoria/:uid", deleteCategoryValidator, deleteFileOnError, eliminarCategorias)

export default router