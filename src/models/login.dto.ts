import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

class LoginCredDto {
  @IsString()
  public user_name: string;
 
  @IsString()
  public password: string; 

}

export class ResetPassword {

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public old_password: string;
 
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public new_password: string; 

}
 
export default LoginCredDto;