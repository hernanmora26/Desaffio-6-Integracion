import fs from "fs";
import { productManager } from "../managers/index.js"

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    #newID; // Variable privada para gestionar los ID´s de productos

    fileExist() {
        return fs.existsSync(this.filePath)
    }

    async getCarts() {
        try {
            if (this.fileExist) {
                const carts = await fs.promises.readFile(this.filePath, "utf-8");
                return JSON.parse(carts);
            } else {
                throw new Error("Error al intentar recuperar los carritos.");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async addCart() {
        try { 
            const fileCarts = await this.getCarts(); // Obtiene los productos del archivo
            
            // Asignación de ID al carritoCartsCarts
            if (fileCarts.length == 0) {
                this.#newID = 1;
            } else {
                this.#newID = fileCarts[fileCarts.length - 1].cartId + 1;
            }

            const newCart = {
                cartId: this.#newID,
                products: []
            }

            fileCarts.push(newCart);
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileCarts, null, "\t"));
            console.log("Carrito creado.");
            return(newCart);

        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getCartsById(cartId) {
        try {
            const fileCarts = await this.getCarts(); 
            const cartFind = fileCarts.find((elem) => elem.cartId === cartId);
            // Verifica si el ID ingresado existe
            if (!cartFind) {
                console.log("No se encontró carrito con el id indicado")
            }

            return (cartFind); 
        } catch (error) {
            console.error(error.message);
            throw error;
        }

    }

async addProductToCart(cartId, productId){
    try {
        const fileCarts = await this.getCarts();
        const cart = await this.getCartsById(parseInt(cartId));
        const product = await productManager.getPtoductById(parseInt(productId));
       
        if (cart) {
            const cartIndex = fileCarts.findIndex((elem) => elem.cartId === cart.cartId);
            if (product){
                const productIndex = cart.products.findIndex((elem) => elem.id === product.id);

            if (productIndex !== -1) { // Si el producto ya existe en el carrito, incrementa la cantidad en 1
                fileCarts[cartIndex].products[productIndex].quantity += 1;

            } else { // Si el producto no existe en el carrito, agrégalo con una cantidad inicial de 1
                fileCarts[cartIndex].products.push({id: parseInt(productId), quantity: 1});
            }
    
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileCarts, null, "\t"));
            return (fileCarts[cartIndex].products[productIndex]);
            }
            
        }

    } catch (error) {
        console.log("Error al agregar producto al carrito:", error)
    }
}


}

export { CartManager };