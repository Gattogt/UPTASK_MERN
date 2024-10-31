It all starts in server.js.

# iniciamos nuestras variables de entorno de env
1. instalamos dotenv con npm
2. creamos un .env file en el root de nuestro proyecto
3. importamos dontenv y utilizamos dotenv.config()
# iniciamos nuestra connecion con la base de datos
1. importamos la funcion que se connecta a la base de datos y la mandamos llamar.
2. la funcion es asyncrona y contiene un try catch. utiliza await mongoose.connect() y recive como parametro el string connection
# iniciamos la app con la funcion de express

# abilitamos nuestra applicasion para usar json
app.use(express.json())
# abilitamos CORS en nuestra app
1. instalamos y luego importamos cors 
2. abiltamos app.use(cors({objecto de configuracion}))
# utilisamos la funcion use de nuestra app para especificar la root de nuestras rutas
1. app.use('rutas/misrutas', misRutas)
2. misRutas es el router que especificaremos para nuestras diferentes rutas. podemos tener mas de un router