module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });
    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });
    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerCanciones(criterio, function (canciones){
            if(res.usuario != canciones.autor){
                res.status(400);
                res.json({
                    error: "No eres el autor de esta canción!"
                });
            } else{
                gestorBD.eliminarCancion(criterio,function(canciones){
                    if ( canciones == null ){
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send( JSON.stringify(canciones) );
                    }
                });
            }
        });

    });
    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        var valido = validarInserción(cancion);
        // ¿Validar nombre, genero, precio?
        if(valido) {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertada",
                        _id: id
                    })
                }
            });
        } else {
            res.status(500);
            res.json({
                error: "Error de validación de campos"
            })
        }

    });
    function validarInserción(cancion){
        if(cancion.nombre == null || cancion.nombre.trim() == "") //No length limits since there are songs titled
           return false;                                           // "I" or "E!" for example and it wouldn't make sense
                                                                   // as a store to limit our product range
        if(cancion.genero == null || cancion.genero.trim() == "")
            return false;
        if(cancion.precio == null || cancion.precio < 0) // As before, it makes no sense to establish a price limit
            return false;
        return true;
    }
    app.put("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) }
        let cancion = {}; // Solo los atributos a modificar
        gestorBD.obtenerCanciones(criterio, function (canciones){
            if(res.usuario != canciones[0].autor){
                res.status(400);
                res.json({
                    error: "No eres el autor de esta canción!"
                });
            } else{
                if ( req.body.nombre != null)
                    cancion.nombre = req.body.nombre;
                if ( req.body.genero != null)
                    cancion.genero = req.body.genero;
                if ( req.body.precio != null)
                    cancion.precio = req.body.precio;
                var valido = validarModificación(cancion);
                if (valido) {
                    gestorBD.modificarCancion(criterio, cancion, function (result) {
                        if (result == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "canción modificada",
                                _id: req.params.id
                            })
                        }
                    });
                } else {
                    res.status(400);
                    res.json({
                        error: "Error de validación de campos"
                    })
                }
            }
        });

        });
    function validarModificación(cancion){
        if(cancion.nombre != null && cancion.nombre.trim() == "") //No length limits since there are songs titled
            return false;                                           // "I" or "E!" for example and it wouldn't make sense
                                                                    // as a store to limit our product range
        if(cancion.genero != null && cancion.genero.trim() == "")
            return false;
        if(cancion.precio != null && cancion.precio < 0) // As before, it makes no sense to establish a price limit
            return false;
        return true;
    }
    app.post("/api/autenticar/", function(req,res){
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios){
            if(usuarios == null || usuarios.length == 0){
                res.status(401); //Unauthorized
                res.json({autenticado: false})
            } else{
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });

            }
        });
    });
}
