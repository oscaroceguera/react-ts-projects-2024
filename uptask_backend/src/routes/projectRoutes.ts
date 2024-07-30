import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputError } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router();

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatorio"),
  handleInputError,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputError,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatorio"),
  handleInputError,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputError,
  ProjectController.deleteProyect
);

// Routes for tasks

// middelware validate rpoject exists
router.param("projectId", validateProjectExists);

router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El Nombre de la tarea es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la tarea es Obligatoria"),
  handleInputError,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

// middleware validar tasks exists
router.param("taskId", taskExists);
// middleware validar si la tarea pertenece a un proyecto
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputError,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  body("name").notEmpty().withMessage("El Nombre de la tarea es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la tarea es Obligatoria"),
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputError,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputError,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputError,
  TaskController.updateStatus
);

export default router;
