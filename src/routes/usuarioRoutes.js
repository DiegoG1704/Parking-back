import { Router } from "express";
import { CreateUsuario, DeleteUsuario, EditUsuario, getUsuario, Login } from "../Controller/usuarioCrontroller.js";

const routes = Router();

routes.get('/ping', getUsuario)
routes.post('/CreateUsuario', CreateUsuario)
routes.put('/usuarios/:id', EditUsuario)
routes.delete('/usuarios/:id', DeleteUsuario)
routes.post('/login',Login)

export default routes;