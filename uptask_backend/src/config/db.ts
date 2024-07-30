import mongoose from "mongoose";
import color from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);

    const url = `${connection.host}:${connection.port}`;

    console.log(color.magenta.bold(`MogoDB Connectado en: ${url}`));
  } catch (error) {
    console.log(color.red.bold("Error al conectar con MongoDB"));
    exit(1);
    // process.exit(1)
  }
};
