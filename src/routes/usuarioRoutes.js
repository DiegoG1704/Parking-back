import { Router } from "express";
import { getUsuario } from "../Controller/usuarioCrontroller.js";

const routes = Router();

routes.get('/ping', getUsuario)

export default routes;