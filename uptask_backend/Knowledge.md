# mongoose:{mongoose, Schema, Document}
  1. await mongoose.connect()
  2. new Schema({})
  3. Document TYPESCRIPT
  4. mongoose.model("Modelo", miSchema)

# express:{express, Router, Request, Response}
  1. const app = express()
  2. const route = Router()
  3. app.use(express.json())
  4. app.use("ruta/proyectos", mynorRutas)
  5. req: Request, res: Response TYPESCRIPT

 # express-validator: {body, param}
  1. body('projectClient').notEmpty().withMessage('VALIDATION MESSAGE GOES HERE')
  2. param('id').isMongoId().withMessage('VALIDATION MESSAGE GOES HERE')

 # ways to relate documents with MongoDB & Mongoose
  1. One to One : las tareas solo pueden tener refrencia a un proyecto
  2. Many to One: un proyecto puede tener refrencia a varias tareas

  