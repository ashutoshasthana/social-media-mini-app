import { Service,Container } from 'typedi';
import bcrypt from 'bcrypt';
import { response,NextFunction } from 'express';
import knex from '../data/knex';
import HttpException from '../exceptions/HttpException';
import { User } from '../models/user.dto';
import { ResetPassword } from '../models/login.dto';
import jwt from 'jsonwebtoken';
import config from '../config';
import atob from 'atob';
import app_constant, { Tables } from '../../app-constant';


@Service()
export class LoginService {  
    logger:any;

    constructor(user_name:string,password:string){ 
    this.logger = Container.get('logger');
    }

/**
 *
 *Method Used to Login User and return User Data
 * @memberof LoginService
 */
public  userLogin = async (user_name:string,password:string):Promise<any> => {    
    const checkAccount =  await knex(Tables.ACCOUNTS).select('*').where({user_name:user_name});//Fetching account record from db   
   
    if(checkAccount.length > 0){
      //Here we are comparing encrypted password with its original form      
      const doPasswordsMatch = await bcrypt.compareSync(password,checkAccount[0].password);        
      if(doPasswordsMatch) {   
        const userData = await knex(Tables.USERS).select("*").where({user_id:checkAccount[0].user_id});
        const token = this.generateToken(userData[0]);          
        return { user:userData[0],token};        
      } else {
        this.logger.error("Invalid password");
       throw new HttpException(404,false,'Invalid password');  
     }   
    }
    throw new HttpException(404,false,'User Not Found');
  }


  //Service method to Reset password
  public resetPassword = async (content:ResetPassword,user:User)=>{   
    try {
      console.log("User data",user); 
      const checkAccount =  await knex(Tables.ACCOUNTS).select('*').where({user_id:user.user_id});
      if(checkAccount.length > 0)
      {
        const doPasswordsMatch = await bcrypt.compareSync(content.old_password,checkAccount[0].password);
        console.log("doPasswordsMatch ",doPasswordsMatch);
        if(doPasswordsMatch){
          const hashedPassword = await bcrypt.hash(content.new_password, 10);
          const response = await knex(Tables.ACCOUNTS).update({password:hashedPassword}).where({user_id:user.user_id});
          return {success:true,status:200,message:"Password Reset successfully."}
        }  
        throw new HttpException(404,false,'Could Not reset password ');
      }
      throw new HttpException(404,false,'Could Not reset password ');   
    } catch(e){

      throw new HttpException(404,false,'Could Not reset password 3');  
    }

  }


  


  

  /**
   *Generate web Token After login
   * @param user 
   */
  private generateToken = (user:User)=> {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user.user_id}`);
    return jwt.sign(
      {
         user: user, // We are gonna use this in the middleware 'isAuth'
        // role: user.role_id,
        // name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

}