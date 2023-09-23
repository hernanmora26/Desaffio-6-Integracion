import fs from "fs";


class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    #newID; // Variable privada para gestionar los ID´s de productos

    // Metodo sincrono para verificar si el archivo existe
    fileExist() {
        return fs.existsSync(this.filePath)
    }

    // Metodo para obtener todos los productos del archivo. Tambien valida que el archivo exista utilizando el método anterior.
    async getProducts() {
        try {
            if (this.fileExist) {
                const products = await fs.promises.readFile(this.filePath, "utf-8");
                return JSON.parse(products);
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    // Metodo para agregar productos
    async addProduct(product) {
        try { // Se verifica que todos los campos para el nuevo producto sean ingresados
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error("Todos los campos son obligatorios");

            }
            const fileProducts = await this.getProducts(); // Obtiene los productos del archivo
            const codeExist = fileProducts.find((elem) => elem.code === product.code); // Busca si el codigo de producto ingresado ya existe

            if (codeExist) {
                throw new Error("El codigo de producto ya existe. No se agrega el producto");
            };

            // Asignación de ID al producto
            if (fileProducts.length == 0) {
                this.#newID = 1;
            } else {
                this.#newID = fileProducts[fileProducts.length - 1].id + 1;
            }

            // Se crea el nuevo producto
            const newProduct = {
                id: this.#newID,
                ...product,
                status: true
            }

            // Se graba en el archivo el nuevo producto
            fileProducts.push(newProduct);
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileProducts, null, "\t"));
            console.log("Producto agregado");
            return(newProduct);


        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    // Metodo para buscar productos por us ID
    async getPtoductById(productId) {
        try {
            const fileProducts = await this.getProducts(); // Obtiene los productos del archivo
            const productFind = fileProducts.find((elem) => elem.id === productId); // Busca el ID ingresado entre los productos existentes

            if (! productFind) {
                console.log("No se encontró producto con el id indicado");
            }

            return productFind; // Retorna el producto encontrado

        } catch (error) {
            console.log(error.message);
            throw error;
        }

    }

    // Metodo para modificar un producto. Recibe ID de producto y modificaciones (en foma de objeto)
    async updateProduct(productId, update) {
        try { 
            // Verifica si al menos una de las propiedades está presente en el objeto 'update'
            if (!('title' in update || 'description' in update || 'price' in update || 'thumbnail' in update || 'code' in update || 'stock' in update)) {
                return console.log("Error al intentar modificar el producto. Debe proporcionar al menos una de las propiedades: title, description, price, thumbnail, code, stock.");
            }

             // Verifica que no haya propiedades adicionales en 'update'
            for (const key in update) {
                if (!['title', 'description', 'price', 'thumbnail', 'code', 'stock'].includes(key)) {
                    return console.log(`Error al intentar modificar el producto. Propiedad no permitida: ${key}`);
                }
            }

            const fileProducts = await this.getProducts(); // Obtiene los productos del archivo
            const productFind = fileProducts.find((elem) => elem.id === productId); // Busca el ID ingresado entre los productos existentes

            // Verifica si el ID ingresado existe
            if (! productFind) {
                return console.log("No se encontró producto para modificar con el id indicado");

            }

            const productIndx = fileProducts.findIndex((elem) => elem.id === productId); // Busca el indice del producto a modificar
            fileProducts[productIndx] = {
                ... fileProducts[productIndx],
                ...update
            } 
            
            // Se guardan las modificaciones
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileProducts, null, "\t")); // Se graba el archivo
            console.log("Producto modificado:", fileProducts[productIndx])

        } catch (error) {
            console.log(error.message);
            throw error;
        }

    }

    // Metodo para eliminar un producto por su ID
    async deleteProduct(productId) {
        try {
            const fileProducts = await this.getProducts();
            const deletedProduct = fileProducts.find((elem) => elem.id === productId);

            if (! deletedProduct) { // VeriFica si el ID ingresado existe
                return console.log("No se encuentra producto para borrar con el ID indicado");
            }

            const products = fileProducts.filter((elem) => elem.id !== productId); // Filtra los productos que no coincidadn con el id ingresado
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t")); // Graba en el archivo
            console.log("Producto eliminado: ", deletedProduct);
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}

export { ProductManager };