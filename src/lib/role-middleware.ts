import { Request, Response, NextFunction } from "express";
import { User } from "../api/user/user.entity";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ error: "Access token is missing or invalid" });
      return;
    }

    if (!roles.includes(user.role)) {
      if (user.role == "student") {
        res.status(404).json({ error: "L'utente non è un docente" });
        return;
      }
      if (user.role == "teacher") {
        res.status(404).json({ error: "L'utente non è uno studente" });
        return;
      }
    }

    next();
  };
}
