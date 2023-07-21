import { IsNumber, IsString,IsOptional } from "class-validator";



export class IdentityDto{

        @IsOptional()
        @IsString()
        public email: string;

        @IsOptional()
        @IsNumber()
        public phoneNumber:number;
}
