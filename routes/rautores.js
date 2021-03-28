module.exports = function(app, swig) {
    app.get("/autores", function(req, res) {
        let autores = [ {
            "nombre" : "Kurt Cobain",
            "grupo" : "Nirvana",
            "rol" : "cantante"
        },{
            "nombre" : "Jon Bon Jovi",
            "grupo" : "Bon Jovi",
            "rol" : "cantante"
        },{
            "nombre" : "Robert Plant",
            "grupo" : "Led Zepellin",
            "rol" : "cantante"
        }
        ];

       let respuesta = swig.renderFile('views/autores.html', {
            lista : 'Lista de autores',
            autores : autores
        });

        res.send(respuesta);
    });
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    });
    app.get('/autores+', function (req, res) {
        res.redirect("views/autores.html")
    });
};
