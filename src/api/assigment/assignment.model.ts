import { model, Schema } from "mongoose";
import { ClassroomModel } from "../classroom/classroom.model";
import { Assignment } from "./assignment.entity";


const assignmentSchema = new Schema<Assignment>(
  {
    title: { type: String, required: true },
    students: [{
      _id: false,
      studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: true },
      completed: { type: Boolean, default: false },
      completionDate: { type: Date, default: null }
    }],
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { 
        virtuals: true
      },
    toObject: { virtuals: true } 
  }
);

assignmentSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});


// Virtual per il conteggio studenti completati
assignmentSchema.virtual('completedCount').get(function() {
  return this.students.filter(s => s.completed).length;
});

// Virtual per il conteggio totale studenti
assignmentSchema.virtual('studentsCount').get(function() {
  return this.students.length;
});

// Middleware pre-save per inizializzare la lista studenti
assignmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const classroom = await ClassroomModel.findById(this.classroom)
      .populate('students')
      .exec();
    
    if (classroom) {
      this.students = classroom.students.map(student => ({
        studentId: student._id,
        completed: false,
        completionDate: null
      }));
    }
  }
  next();
});

export const AssignmentModel = model<Assignment>("Assignment", assignmentSchema);