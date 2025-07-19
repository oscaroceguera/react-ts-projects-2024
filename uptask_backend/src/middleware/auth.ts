import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No Autorizado");
    return res.status(401).json({ error: error.message });
  }

  // const token = bearer.split(" ")[1];
  const [, token] = bearer.split(" "); // es lo mismo de arriba

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decode === "object" && decode.id) {
      const user = await User.findById(decode.id).select("_id email name");
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(500).json({ error: "Token No Válido" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Token No Válido" });
  }
};
