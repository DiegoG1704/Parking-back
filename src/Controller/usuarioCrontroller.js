import { pool } from "../db.js";

export const getUsuario = async(req, res) => {
    const result=await pool.query('SELECT "hello word" as RESULT');
    console.log(result)
    res.send('Hello word to server')
}