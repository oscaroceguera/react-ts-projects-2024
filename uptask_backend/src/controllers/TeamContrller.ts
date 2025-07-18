import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("id email name");

    if (!user) {
      const error = new Error("Usuario No Encontrado");
      return res.status(404).json({ error: error.message });
    }

    res.json(user);
  };

  static getProyectTeam = async (req: Request, res: Response) => {
    const project = (await Project.findById(req.project.id)).populate({
      path: "team",
      select: "id email name",
    });

    res.json(project);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    const user = await User.findById({ id }).select("id");

    if (!user) {
      const error = new Error("Usuario No Encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (
      req.project.team.some((team) => team.toString() === user.id.toString())
    ) {
      const error = new Error("El Usuario ya existe en el proyecto");
      return res.status(409).json({ error: error.message });
    }

    req.project.team.push(user.id);
    await req.project.save();

    res.send("Usuario agregado correctamente");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!req.project.team.some((team) => team.toString() === id)) {
      const error = new Error("El Usuario no existe en el proyecto");
      return res.status(409).json({ error: error.message });
    }

    req.project.team = req.project.team.filter(
      (teamMember) => teamMember.toString() !== id
    );
    await req.project.save();

    res.send("Usuario fue removido correctamente");
  };
}
