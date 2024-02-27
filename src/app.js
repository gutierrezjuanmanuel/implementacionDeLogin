const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const viewsRouter = require("./routes/views.router.js");
//Passport: 
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
//////////
const app = express(); 
const PUERTO = 8081;
require("./database.js");

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gutierrezmanueljuan:jmg35960568982@cluster0.vuvwwx5.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))
/////Cambios Passport 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);


//Login de usuario con Session: 




//Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO} `);
})