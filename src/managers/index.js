import { ProductManager } from "./productmanager.js";
import { CartManager } from "./cartmanager.js";

import { __dirname } from "../utils.js";
import path from "path";

export const productManager = new ProductManager(path.join(__dirname, "/managers/data/products.json"));
export const cartManager = new CartManager(path.join(__dirname, "/managers/data/carts.json"));