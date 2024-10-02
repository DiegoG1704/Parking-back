import { pool } from "../db.js";

export const getUsuario = async(req, res) => {
    const result=await pool.query('SELECT "hello word" as RESULT');
    console.log(result)
    res.send('Hello word to server')
}

export const CreateUsuario = async (req, res) => {
    const { nombre, correo, contraseña, telefono } = req.body;

    try {
        // Validations
        if (!nombre || !correo || !contraseña) {
            return res.status(400).send('Nombre, correo y contraseña son requeridos.');
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).send('El correo no es válido.');
        }

        // Password length validation
        if (contraseña.length < 6) {
            return res.status(400).send('La contraseña debe tener al menos 6 caracteres.');
        }

        // Phone format validation (optional)
        if (telefono && !/^\+?[1-9]\d{1,14}$/.test(telefono)) {
            return res.status(400).send('El teléfono no tiene un formato válido.');
        }

        const sql = 'INSERT INTO Usuarios (nombre, correo, contraseña, telefono) VALUES (?, ?, ?, ?)';
        const result = await new Promise((resolve, reject) => {
            pool.query(sql, [nombre, correo, contraseña, telefono], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        res.status(201).send({ message: 'Usuario creado exitosamente', usuario_id: result.insertId });
    } catch (err) {
        res.status(500).send('Error al crear el usuario: ' + err.message);
    }
};

export const EditUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contraseña, telefono } = req.body;

    try {
        // Validations
        if (!nombre || !correo || !contraseña) {
            return res.status(400).send('Nombre, correo y contraseña son requeridos.');
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).send('El correo no es válido.');
        }

        // Password length validation
        if (contraseña.length < 6) {
            return res.status(400).send('La contraseña debe tener al menos 6 caracteres.');
        }

        // Phone format validation (optional)
        if (telefono && !/^\+?[1-9]\d{1,14}$/.test(telefono)) {
            return res.status(400).send('El teléfono no tiene un formato válido.');
        }

        const sql = 'UPDATE Usuarios SET nombre = ?, correo = ?, contraseña = ?, telefono = ? WHERE usuario_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(sql, [nombre, correo, contraseña, telefono, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.status(200).send('Usuario actualizado exitosamente');
    } catch (err) {
        res.status(500).send('Error al actualizar el usuario: ' + err.message);
    }
};

export const DeleteUsuario = async (req, res) => {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
        return res.status(400).send('ID del usuario es requerido y debe ser un número válido.');
    }

    const sql = 'DELETE FROM Usuarios WHERE usuario_id = ?';
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.status(200).send('Usuario eliminado exitosamente');
    } catch (err) {
        res.status(500).send('Error al eliminar el usuario: ' + err.message);
    }
};

export const Login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Validations
        if (!correo || !contraseña) {
            return res.status(400).send('Correo y contraseña son requeridos.');
        }

        const sql = 'SELECT * FROM Usuarios WHERE correo = ?';
        const results = await new Promise((resolve, reject) => {
            pool.query(sql, [correo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = results[0];

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        if (contraseña !== usuario.contraseña) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Si la contraseña es correcta, iniciar sesión
        res.status(200).send({
            message: 'Inicio de sesión exitoso',
            usuario: { usuario_id: usuario.usuario_id, nombre: usuario.nombre, correo: usuario.correo }
        });
    } catch (err) {
        res.status(500).send('Error en el servidor: ' + err.message);
    }
};