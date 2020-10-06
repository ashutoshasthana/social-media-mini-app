import { IsString } from 'class-validator';

class LoginCredDto {
  @IsString()
  public user_name: string;
 
  @IsString()
  public password: string; 

}
 
export default LoginCredDto;