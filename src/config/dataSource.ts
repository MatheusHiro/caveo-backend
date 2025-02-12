import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  migrations: ["./migrations/*.ts"],
});


const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");
    await AppDataSource.runMigrations();
    console.log("Migrations applied successfully!");
  } catch (err) {
    console.error("Error connecting to DB", err);
    setTimeout(connectToDatabase, 5000);
  }
};

export default connectToDatabase;