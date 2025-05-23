import { ClassroomModel } from "./classroom.model";
import { Classroom } from "./classroom.entity";
import { Assignment } from "../assigment/assignment.entity";
import { AssignmentModel } from "../assigment/assignment.model";
import { User } from "../user/user.entity";

export async function createClass(
  name: string,
  students: string[] | User[],
  userId: string | User
): Promise<Classroom> {
  if (!name) throw new Error("Classroom name is required");

  const newClassroom = await ClassroomModel.create({
    name: name,
    students: students,
    user: userId,
  });

  return newClassroom.toObject();
}

export async function setAssigment(
  title: string,
  userId?: string,
  classroomId?: string,
  classroom?: any
): Promise<Assignment> {
  const newAssignment = await AssignmentModel.create({
    title: title,
    createdBy: userId,
    classroom: classroomId,
    students: classroom.students.map((studentId) => ({
      studentId,
      completed: false,
    })),
  });

  // aggiungi l'assignment alla classe
  await ClassroomModel.updateOne(
    { _id: classroomId },
    { $push: { assignments: newAssignment._id } }
  )
    .populate("createdBy")
    .exec();

  return newAssignment.toObject();
}

export async function displayAssignments(userId?: string, classroomId?: string): Promise<any[]> {
  const list = await AssignmentModel.find({
    classroom: classroomId,
    createdBy: userId
  })
  .populate('createdBy')
  .exec();

  return list.map(assignment => assignment.toObject());
}

export async function changeState(
  userId?: string,
  classroomId?: string,
  assignmentId?: string
): Promise<Assignment | boolean> {
  const assignment = await AssignmentModel.findOne({
    _id: assignmentId,
    classroom: classroomId,
    "students.studentId": userId,
  });

  if (!assignment) {
    return false;
  }

  // trova lo studente nella lista
  const studentEntry = assignment.students.find(
    (s) => s.studentId.toString() === userId
  );

  if (!studentEntry) {
    throw new Error("User not part of this assignment");
  }

  if (studentEntry.completed) {
    return true;
  }

  studentEntry.completed = true;
  studentEntry.completionDate = new Date();
  await assignment.save();

  return assignment.toObject();
}
