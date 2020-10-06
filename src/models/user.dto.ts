import { IsString,IsNumber,IsDate,IsBoolean,IsNotEmpty,ValidateIf ,IsDefined} from 'class-validator';

export class User {
    @IsNumber()
    public id:number;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public user_name:string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public password:string;

    @IsString()
    public tutor_id:string;

    @IsString()
    public institute_id:string;

    @IsString()
    public branch_id:string;

    @IsString()
    public student_id:string;


    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public role_id:string;

    @IsDate()
    public last_access_time:Date;

    @IsBoolean()
    public deleted:boolean;

    @IsString()
    public status:string;

    @IsDate()
    public datetime:Date;

}