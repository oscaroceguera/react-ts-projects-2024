import type { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import User from "../models/User";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El usuario ya existe");
        return res.status(409).json({ error: error.message });
      }

      // crea un user
      const user = new User(req.body);

      // Hash password
      user.password = await hashPassword(password);

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctament");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      // Check cuenta verificada
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // enviar email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un email de confirmacion"
        );
        return res.status(401).json({ error: error.message });
      }

      // Check password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password Incorrecto!!!");
        return res.status(401).json({ error: error.message });
      }

      res.send("Autenticado!!!!!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // user  exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envió un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
