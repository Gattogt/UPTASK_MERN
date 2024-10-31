# lib
- [axios]: funcion de axios preparada con un baseURL para llamar a nuestra API

# api
- [ProjectAPI]: funciones asyncronas que utilizan [axios] como base para luego completar las diferentes rutas que se conectan a nuestra API

# views
- [DashboardView]: esta vista hace una llamada a __useQuery__ de react-query. A esta funcion le pasamos un objeto con una queryKey y una funcion asyncrona proveniente de [ProjectAPI]--getProjects y obtiene via metodo de desestructuracion dos variables: isLoading y data. La data contiene nuestro proyectos.
Si no hay proyectos mostraremos un <p> avisando que no hay proyectos. En caso de haber proyectos entonces 