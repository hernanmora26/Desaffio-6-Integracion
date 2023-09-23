import { Router } from "express";
import { productManager, cartManager } from "../managers/index.js"

const router = Router();

router.get("/", async(req, res)=> {
    try {
        const carts = await cartManager.getCarts();
        res.json({message: "Listado de carritos", data:carts});
    } catch (error) {
        res.json({status:"error",message:error.message});
    }
})

router.get("/:cid", async(req, res)=> {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartsById(cartId);
        res.json({message:"Buscando carrito..", data: cart})
    
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
})

router.post("/", async(req, res)=> {
    try {
        const newCart = await cartManager.addCart();
        res.json({message:"Carrito agregado", data: newCart});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
})

router.post("/:cid/product/:pid", async (req, res)=> {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const productToCart = await cartManager.addProductToCart(cartId, productId);
        res.json({message: "Agregando producto al carrito...", data: productToCart});   

    } catch (error) {
        res.json({status:"error",message:error.message});
    }
    })



export { router as cartsRouter };