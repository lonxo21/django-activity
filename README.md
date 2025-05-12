## Como correr la aplicación
### Para correr el proyecto deben tener instalado [docker](https://docs.docker.com/engine/)
Y se debe correr el comando para construir y levantar los contenedores (en ubuntu sería):

`sudo docker compose up --build`

### Una vez terminado el proceso ir a:
[http://127.0.0.1:5173](http://127.0.0.1:5173)

## Observaciones y aclaraciones
La aplicación está en modo desarrollo: el frontend y el backend están siendo servidos por servidores que no deben ser usados en producción. Sin embargo, me divirtió el proyecto, así que seguiré trabajando en él para terminar con lo que sería una versión de producción (en local más no en la nube, por ahora jeje).

El backend será servido con apache (mod_wsgi), y el frontend probablemente con nginx. Ambos serán encriptados con certificados de Let's Encrypt, más que nada porque no he usado apache + certbot y quiero probarlo. Todo esto lo iré subiendo a este repo por si a alguien le interesa.


### Cosas que cambiaría / mejoraría
Como está la aplicación, cuando uno sube un excel, el backend se encarga de guardar en la BDD la información de ambas hojas, actualizando los precios de haber cambiado. Esto quedó así porque no quería que tuvieran que hacer un setup a la página (subir los precios). Pero si quiero que los usuarios de la aplicación puedan ingresar archivos varias veces (con modificaciones probablemente, para testear) y no solamente una vez al inicio. Además no quería modificar el archivo que se me entregó.

Como debería ser: la hoja de precios debería ser subida a la apliación por algún admin (o de forma automática en la construcción del servidor) solo una vez, y lo más seguro es que se le irían agragando precios diariamente, con un endpoint dedicado a ello.
Así, los usuarios solo tendrían que subir la hoja con sus portafolios y los porcentajes de sus acciones. Esto aligeraría mucho la carga al servidor, ya que lo que más tarda es guardar los precios.

También, en el diálogo de compraventa, debería haber un botón en cada fila de input que me permita previsualizar la transacción, osea, debería decirme cuanta cantidad tiene el portafolio, cuanta cantidad se mueve y el resultado después de la operación. Como está en estos momentos, las transacciones se hacen un poco a ciegas (uno puede ver los gráficos para guiarse en precios y cantidades pero no es tan cómodo).

La aplicación está hecha para que sea responsive, con breakpoints para pantallas pequeñas. Lamentablemente, el gráfico de valor_total/tiempo, y sobre todo los tooltips de todos los gráficos no se ven bien en pantallas moviles. Esto se puede arreglar agregando algunos breakpoints.