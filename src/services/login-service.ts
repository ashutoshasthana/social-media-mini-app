import { Service,Container } from 'typedi';
import bcrypt from 'bcrypt';
import { response,NextFunction } from 'express';
import knex from '../data/knex';
import HttpException from '../exceptions/HttpException';
import { User } from '../models/user.dto';
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
public  userLogin = async (user_name:string,password:string,next:NextFunction):Promise<any> => {    
    const userRes =  await knex(Tables.USERS).select('*').where({user_name:user_name});//Fetching user record from db   
    if(userRes.length > 0){
      const userpass = atob(password);//Here we are converting encrypted password into its original form through 'atob'      
      const doPasswordsMatch = await bcrypt.compare(userpass,userRes[0].password); 
      const token = this.generateToken(userRes[0]);
      if(doPasswordsMatch) {          
        Reflect.deleteProperty(userRes[0], 'password');       
        return { user:userRes[0],token};        
      } else {
       throw new HttpException(404,false,'Invalid password');  
     }   
    }
    throw new HttpException(404,false,'User Not Found');
  }



  public newUserSignup = async (userData:User):Promise<any>=>{       
    try {
      const atb = atob(userData.password);
      const passwordInPlainText = atb;     
      const hashedPassword = await bcrypt.hash(passwordInPlainText, 10);
      //userData.password = hashedPassword;
     const registerRes = await knex(Tables.USERS).insert(userData);
     return { userid:registerRes[0] };     
    } catch(e){
      throw new HttpException(401,false,'User Registration Faild!');
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