//Módulos
let express = require('express');
let app = express();

// Variables
app.set('port', 8081)
app.get('/usuarios', function(req, res) {
    console.log("depurar aquí");
    res.send('ver canciones');
});
// lanzar el servidor
app.listen(app.get('port'), function (){
    console.log('Servidor activo');
});