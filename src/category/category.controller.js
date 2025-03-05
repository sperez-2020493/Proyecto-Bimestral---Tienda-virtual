import categoryModel from './category.model.js';
import Category from './category.model.js';

export const categoríaDefaut = async () => {
    try {
        const category = await Category.findOne({ nameCategory: "General" });
        if (!category) {
            await Category.create({
                nameCategory: "General",
                description: "Todo producto sin catalogar",
                status: true
            });
        } else {
        }
    } catch (err) {
    }
};

export const crearCategoria = async (req, res) => {
    try {
      const data = req.body;
        const existCategory = await Category.findOne({ nameCategory: data.nameCategory });
      if (existCategory) {
        return res.status(400).json({
          success: false,
          msg: "Ya existe una categoría con este nombre",
        });
      }
  
      const category = new Category(data);
      await category.save();  
      return res.status(200).json({
        success: true,
        msg: `Categoría '${data.nameCategory}' creada exitosamente`,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
        msg: "Error al crear la categoría", 
        error 
      });
    }
  };

  export const editarCategorias = async (req, res) => {
    try {
        const { uid } = req.params; 
        const updates = req.body; 
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const updatedCat = await Category.findByIdAndUpdate(uid, { $set: updates }, { new: true });

        if (!updatedCat) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Categoría actualizada correctamente",
            category: updatedCat,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la categoría",
            error: err.message,
        });
    }
};


export const eliminarCategorias = async (req, res) => { 
    const { uid } = req.params;
    try {
      const category = await Category.findById(uid);
      const generalCategory = await Category.findOne({ nameCategory: "General" });
      if (!generalCategory) {
        return res.status(404).json({
          success: false,
          message: "No se encontró la categoría 'General'"
        });
      }
  
      await Post.updateMany(
        { category: uid }, 
        { $set: { category: generalCategory._id } }
      );
  
      await category.deleteOne();
  
      return res.status(200).json({
        success: true,
        message: "Categoría eliminada y productos actualizados a la categoria General",
        category
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Error al eliminar la categoría y actualizar los productos",
        error: error.message
      });
    }
  };