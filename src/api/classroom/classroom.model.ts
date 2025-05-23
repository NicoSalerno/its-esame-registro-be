import { model, Schema } from "mongoose";
import { Classroom } from "./classroom.entity";

const classroomSchema = new Schema<Classroom>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 2
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    user: { type: Schema.Types.ObjectId, ref: 'User' } 
  },
);

{
  classroomSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
}

// Definizione del virtual property
classroomSchema.virtual('studentsCount').get(function() {
  return this.students?.length || 0;
});


export const ClassroomModel = model<Classroom>("Classroom", classroomSchema);