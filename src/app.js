import express from "express";
import { engine } from 'express-handlebars';
import { __dirname } from "./utils.js";
import path from "path";

import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";


//Servidor express
const app = express();
const port = 8080;
app.use(express.urlencoded({extended:true}));
app.listen(port, ()=> console.log(`Servidor ejecutándose en el puerto ${port}`));

//Middelware para parseo de json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middelware carpeta public
app.use(express.static(path.join(__dirname,"/public")));

//Vonfiguracion del motor de plantillas
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views")); //=> /src/views


//Routes
app.use("/" , viewsRouter) // Vistas de handlebars
app.use ("/api/products", productsRouter);
app.use ("/api/carts", cartsRouter);