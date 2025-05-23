import { Schema } from "mongoose";

export type Assignment = {
    id?: string;
    title: string;
    students: {
      studentId: Schema.Types.ObjectId;
      completed: boolean;
      completionDate: Date | null;
    }[];
    classroom: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    createdAt: Date;
  };