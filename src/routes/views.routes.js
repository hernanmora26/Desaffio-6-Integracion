import { Router } from "express";
import { productManager } from "../managers/index.js";

const router = Router();

router.get("/", async (req, res)=> {
    try {
        const products = await productManager.getProducts();
        console.log("Productos desde home: ", products)
        res.render("home", {products});
    } catch (error) {
        res.status(500).send(error.messaje);
    }
 
})

export { router as viewsRouter }