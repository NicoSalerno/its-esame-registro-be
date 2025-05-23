import { NextFunction, request, Request, Response } from "express";
import {
  changeState,
  createClass,
  displayAssignments,
  setAssigment,
} from "./classroom.service";
import { classroomDTO } from "./classroom.dto";
import { User } from "../user/user.entity";
import { ClassroomModel } from "./classroom.model";
import { TypedRequest } from "../../lib/typed-request.interface";

export const createClassroom = async (
  req: TypedRequest<classroomDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, students = [] } = req.body;
    const userId = req.user as User;

    const classroom = await createClass(name, students, userId);

    res.status(200).json({
      id: classroom.id,
      name: classroom.name,
      studentsCount: classroom.studentsCount,
    });
  } catch (err: any) {
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: "Error creating classroom",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const getClassrooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;

    let classrooms;

    if (user.role === "teacher") {
      // Se l'utente è un docente, restituisce tutte le classi da lui create
      classrooms = await ClassroomModel.find({ user: user.id })
        .populate("user")
        .populate("students");
    } else if (user.role === "student") {
      // Se l'utente è uno studente, restituisce le classi in cui è presente
      classrooms = await ClassroomModel.find({ students: user.id })
        .populate("user")
        .populate("students");
    } else {
      throw new Error("Ruolo non valido");
    }

    res.status(200).json(classrooms);
  } catch (err) {
    next(err);
  }
};

export const setAssigmentToClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classroomId } = req.params;
    const userId = req.user as User;
    const { title } = req.body;

    const findClass = await ClassroomModel.findOne({
      _id: classroomId,
      user: userId,
    });

    if (!findClass) {
      res.status(404).json({ error: "Class not found" });
    }

    const x = await setAssigment(title, userId.id, classroomId, findClass);

    res.status(200).json(x);
  } catch (err: any) {
    next(err);
  }
};

export const seeAssigmentOfClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classroomId } = req.params;
    const userId = req.user as User;

    const findClass = await ClassroomModel.findOne({
      _id: classroomId,
      user: userId,
    });

    if (!findClass) {
      res.status(404).json({ error: "Class not found" });
    }

    const x = await displayAssignments(userId.id, classroomId);

    res.status(200).json(x);
  } catch (err: any) {
    next(err);
  }
};

export const setTrue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classroomId, id: assignmentId } = req.params;
    const user = req.user as User;

      const result = await changeState(user.id, classroomId, assignmentId);

      if (result === true) {
        res.status(400).json({ error: "Already completed" });
      } else if (result === false) {
        res
          .status(404)
          .json({
            error:
              "L'id della classroom o dell'attività non esiste oppure l'attività non è associata alla classroom",
          });
      } else {
        res.status(201).json(result);
      }
    
  } catch (err: any) {
    next(err);
  }
};
