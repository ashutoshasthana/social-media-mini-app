import { IsString,IsNumber,IsDate,IsBoolean,IsNotEmpty,ValidateIf ,IsDefined, IsEmail,isString, minLength} from 'class-validator';

export class User {

    @IsNumber()
    public id:number;

    @IsString()  
    public user_id:string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public first_name:string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public last_name:string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    public email:string;
    
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public password:string;

    @IsString()   
    public mobile_number:number;

    @IsString()   
    public photo_url:string;

    @IsDate()   
    public birthday:Date;

    @IsDate()   
    public create_time:Date;

    @IsDate()
    public update_time:Date;  

}