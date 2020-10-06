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
import crypto from 'crypto';
import moment from 'moment';


@Service()
export class UserService {  
    logger:any;

    constructor(){ 
    this.logger = Container.get('logger');
    }




  /**
   *Method used to Create new User
   *
   * @memberof UserService
   */
  public addNewUser = async (user:User):Promise<any>=>{      
    try { 
    const { password } = user;
    const  user_id =  crypto.randomBytes(10).toString("hex");
    const create_time = new Date();
    const update_time = create_time;    
    user = { ...user ,user_id,update_time,create_time };
    Reflect.deleteProperty(user,'password');
    const addRes = await knex(Tables.USERS).insert(user).returning('*');
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountObj = {user_name:addRes[0].email,password:hashedPassword,user_id:addRes[0].user_id,create_time,update_time}
    const addAccRes = await knex(Tables.ACCOUNTS).insert(accountObj).returning("*");
    return { success:"true",status:200,message:"Account Created Successfully."};     
    } catch(e){
        console.log("Error : ",e);
      throw new HttpException(401,false,'Cannot Create User !');
    }
  }



}