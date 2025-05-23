import { IsOptional, IsString} from "class-validator";

export class listDTO {
    @IsOptional()
    @IsString()
    role: string;
}