import { hash } from "argon2"
import User from "../user/user.model.js"

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
        const { uid } = req.params; 
        const usuario = await User.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const { name, surname, username, email, phone, role } = req.body;

        if (name) usuario.name = name;
        if (surname) usuario.surname = surname;
        if (username) usuario.username = username;
        if (email) usuario.email = email;
        if (phone) usuario.phone = phone;
        if (role) usuario.role = role;

        await usuario.save();
        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user: usuario
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: err.message
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.status = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
};