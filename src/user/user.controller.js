import { hash } from "argon2"
import User from "../user/user.model.js"
import jwt from 'jsonwebtoken';
import  Producto  from "../product/product.model.js"; 
import  Category  from "../category/category.model.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password)
        data.password = encryptedPassword
        data.profilePicture = profilePicture

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
}

export const modificarUsuarios = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        let descodificar;
        try {
            descodificar = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado',
                error: err.message,
            });
        }

        const userId = descodificar.uid;
        const { uid } = req.params; 
        const userEditar = await User.findById(uid);
        if (!userEditar) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const usuarioToken = await User.findById(userId);

        if (usuarioToken.role === 'ADMIN_ROLE') {
            if (userEditar.role === 'ADMIN_ROLE' && userId !== uid) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar a otro administrador',
                });
            }
        } else if (usuarioToken.role === 'CLIENTE_ROLE') {
            if (userId !== uid) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar otro usuario',
                });
            }
        }

        Object.assign(userEditar, req.body);

        await userEditar.save();

        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            user: userEditar,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: err.message,
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        let descodificar;
        descodificar = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userId = descodificar.uid;
        
        const { uid } = req.params;

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        if (userId !== uid.toString()) {
            const userRequesting = await User.findById(userId);
            
            if (userRequesting.role === 'ADMIN_ROLE') {
                if (user.role === 'ADMIN_ROLE') {
                    return res.status(403).json({
                        success: false,
                        message: 'No puedes eliminar a otro administrador',
                    });
                }
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar este usuario',
                });
            }
        }

        await User.findByIdAndDelete(uid);

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente',
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
            error: err.message,
        });
    }
};

export const eliminarUsuarioPublic = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        let descodificar;
        descodificar = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userId = descodificar.uid;
        
        const { uid } = req.params;

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        if (userId !== uid.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este usuario',
            });
        }

        await User.findByIdAndDelete(uid);

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente',
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
            error: err.message,
        });
    }
};


export const admimDefaul = async () => {
    try {
        const admin = await User.findOne({ role: "ADMIN_ROLE" });

        if (!admin) {
        await User.create({
            name: "Admin",
            surname: "Admin",
            username: "Admin",
            email: "admin@gmail.com",
            password: await hash("Admin/14", 10), 
            profilePicture: "default",    
            phone: "12345678",
            role: "ADMIN_ROLE",
            });
        } else {
        }
    } catch (err) {
    }
};