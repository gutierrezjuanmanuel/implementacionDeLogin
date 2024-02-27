const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gutierrezmanueljuan:jmg35960568982@cluster0.vuvwwx5.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion exitosa"))
    .catch(() => console.log("Vamos a morir, siguen los errores"))