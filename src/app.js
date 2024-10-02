import express from 'express'
import usuarioRouter from './routes/usuarioRoutes.js'
import { PORT } from './config.js'
import morgan from 'morgan'

const app = express()

app.get('/',(req, res)=>{
    res.send('Hello word')
})
app.use(morgan('dev'))

app.use(usuarioRouter)


app.listen(PORT)
console.log('Server on port',PORT)