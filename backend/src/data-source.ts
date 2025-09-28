import { DataSource } from "typeorm";
import { User } from "./users/user.entity";
import { Order } from "./orders/order.entity";
import { Product } from "./products/product.entity";
import { Category } from "./categories/category.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "autofina",
    synchronize: false,
    logging: true,
    entities: [User, Order, Product, Category],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscriber/*.ts"],
});
