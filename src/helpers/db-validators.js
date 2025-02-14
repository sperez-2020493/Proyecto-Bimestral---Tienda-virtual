import User from "../user/user.model.js"


export const emailExists = async(email = "") =>{
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}
 
export const usernameExist = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The user ${username} is already registered`)
    }
}

export const userExists = async (uid =" ") =>{
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el ID del usario proporcionado")
    }
}



export const adminRoleValidator = async (uid = "", { req }) => {
    const usuarioAModificar = await User.findById(uid);
    if (!usuarioAModificar) {
        throw new Error("Usuario no encontrado");
    }

    if (usuarioAModificar.role === "ADMIN_ROLE" && req.user.role === "ADMIN_ROLE") {
        throw new Error("No tienes permisos para modificar a otro admin");
    }
};

export const noEliminarAdminValidator = async (uid = "", { req }) => {
    const usuarioAEliminar = await User.findById(uid);
    
    if (!usuarioAEliminar) {
        throw new Error("No existe el ID del usuario proporcionado");
    }

    if (usuarioAEliminar.role === "ADMIN_ROLE" && req.user.role === "ADMIN_ROLE") {
        throw new Error("No tienes permisos para eliminar a otro administrador");
    }
};

