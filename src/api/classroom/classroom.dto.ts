import { IsString, IsOptional, IsArray, IsMongoId } from "class-validator";

export class classroomDTO {
  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true }) 
  @IsOptional()
  students?: string[]; 
}