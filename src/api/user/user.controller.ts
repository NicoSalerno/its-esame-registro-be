import { Response, NextFunction, Request } from "express";
import { list } from "./user.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { listDTO } from "./user.dto";
import { User } from "./user.entity";
import { TokenNotFoundError } from "../../errors/token-notFound.error";

export const me = async (
    req: Request & { user?: User }, 
    res: Response, 
    next: NextFunction) => {
    
    res.json(req.user);
}

export const printList = async (
  req: TypedRequest<listDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;

    const validRoles = ["student", "teacher"] as const;
    const roleFilter = validRoles.includes(type as any)
      ? (type as "student" | "teacher")
      : undefined;

    if (type && !roleFilter) {
      res.status(400).json({ error: "The role isn't valid" });
    }

    const users = await list(roleFilter);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
