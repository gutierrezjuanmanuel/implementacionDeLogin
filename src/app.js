const express = require("express"); 
const cookieParser = require("cookie-parser");
const session = require("express-session");

// import express from "express";
// import cookieParser from "cookie-parser";

const app = express(); 
const PUERTO = 8081; 

//Middleware
// app.use(cookieParser());
const miAltaClaveSecreta = "TinkiWinki";
app.use(cookieParser(miAltaClaveSecreta));
//Modificación que hacemos para firmar cookies. 
app.use(session({
    secret:"secretCoder",
    resave:true,
    //Esta configuracion me permite mantener activa la sesión frente a la inactividad del usuario. 
    saveUninitialized:true
    //Me permite guardar cualquier sesión aún cuando el objeto de sesión no tenga nada para contener. 
}))

//Middleware de autenticación: 

function auth(req, res, next) {
    if(req.session.user === "tinki" && req.session.admin === true) {
        return next();
    }
    return res.status(401).send("Error de autorizacion");
}


//Rutas

app.get("/", (req, res) => {
    res.send("Hola Mundo!");
})

//Setear una cookie: 

app.get("/setcookie", (req, res) => {
    //Usamos el objeto "res" para asignarle la cookie al cliente. 
    res.cookie("coderCookie", "Mi primera chamba con cookies").send("Cookie seteada!!");
    //Las guardamos en formato "clave - valor". 
    //Esta cookie vive hasta que es eliminada. Si yo quiero que tenga un tiempo de vida limitado puedo hacer lo siguiente: 
    // res.cookie("coderCookie", "Mi primera chamba con cookies",{maxAge: 4000}).send("Cookie seteada!!");
})

//Leemos el valor de una cookie: 

app.get("/leercookie", (req, res) => {
    res.send(req.cookies);
})

//Borramos una cookie. 

app.get("/borrarcookie", (req, res) => {
    res.clearCookie("coderCookie").send("Cookie eliminada!");
})

//Enviar una cookie firmada: 

app.get("/cookiefirmada", (req, res) => {
    res.cookie("cookieFirmada", "Esto es un mensaje secreto", {signed: true}).send("Cookie firmada enviada!");
})

//Obtenemos una cookie firmada: 

app.get("/recuperamoscookiefirmada", (req, res) => {
    //Ahora para recuperar la cookie firmada tengo que utilizar: req.signedCookies

    const valorCookie = req.signedCookies.cookieFirmada;

    if(valorCookie) {
        res.send("Cookie recuperada: " + valorCookie);
    } else {
        res.send("Cookie invalida");
    }
})

//Levantando la session en el endpoint: 

app.get("/session", (req, res) => {
    //Si al conectarme la sesión ya existe aumento el contador. 
    if(req.session.counter) {
        req.session.counter++;
        res.send("Visitaste el sitio: " + req.session.counter + " veces");
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!! Unite al club");
    }
})

//Eliminamos datos de la sesión: 

app.get("/logout", (req, res) => {
    //Para eliminar datos de una variable de session, se utiliza el parametro de req y el método destroy. Lo pasamos con un callback: 
    req.session.destroy( (error ) => {
        if(!error) res.send("Sesión cerrada!");
        else res.send({status:"logout ERROR", body: error})
    })
})

//Login con session: 

app.get("/login", (req, res) => {
    let {usuario, pass} = req.query;

    if(usuario === "tinki" && pass === "winki") {
        req.session.user = usuario;
        req.session.admin = true; 
        res.send("Inicio de sesión exitoso! Vivaaaaa!! ");
    } else {
        res.send("Datos incorrectos, vete ladron malvado!");
    }
})

//Ruta privada con Login: 

app.get("/privado", auth ,(req, res) => {
    res.send("Si llegas hasta acá es porque estas logueado!");
})




//Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO} `);
})