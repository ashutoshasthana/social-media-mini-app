import { Service, Container } from "typedi";
import bcrypt from "bcrypt";
import { response, NextFunction } from "express";
import knex from "../data/knex";
import HttpException from "../exceptions/HttpException";
import { User, SendRequest, EditRequest, Post } from "../models/user.dto";
import jwt from "jsonwebtoken";
import config from "../config";
import atob from "atob";
import app_constant, { Tables, Queries } from "../../app-constant";
import crypto from "crypto";
import moment from "moment";

@Service()
export class UserService {
  logger: any;

  constructor() {
    this.logger = Container.get("logger");
  }

  /**
   *Method used to Create new User
   *
   * @memberof UserService
   */
  public addNewUser = async (user: User): Promise<any> => {
    try {
      const { password } = user;
      const user_id = crypto.randomBytes(10).toString("hex");
      const create_time = new Date();
      const update_time = create_time;
      user = { ...user, user_id, update_time, create_time };
      Reflect.deleteProperty(user, "password");
      const addRes = await knex(Tables.USERS).insert(user).returning("*");
      const hashedPassword = await bcrypt.hash(password, 10);
      const accountObj = {
        user_name: addRes[0].email,
        password: hashedPassword,
        user_id: addRes[0].user_id,
        create_time,
        update_time,
      };
      const addAccRes = await knex(Tables.ACCOUNTS)
        .insert(accountObj)
        .returning("*");
      return {
        success: "true",
        status: 200,
        message: "Account Created Successfully.",
      };
    } catch (e) {
      console.log("Error : ", e);
      throw new HttpException(401, false, "Cannot Create User !");
    }
  };

  /**
   * Service Method used to send request
   */
  public sendRequest = async (inputData: SendRequest, user: User) => {
    try {
      const create_time = new Date();
      const update_time = create_time;
      let addRequestObj = {
        create_time: create_time,
        update_time: update_time,
        requester_id: user.id,
        requested_id: inputData.requested_id,
      };
      const addReqRes = await knex(Tables.REQUESTS)
        .insert(addRequestObj)
        .returning("*");
      if (addReqRes.length > 0) {
        return {
          success: true,
          status: 200,
          message: "Reques Send successfully.",
        };
      }
    } catch (e) {
     this.logger.error("-------- Error : ", e);
      throw new HttpException(401, false, "Could not send Friend request.");
    }
  };

  /**
   * Service Method used to get the list of all Request.
   */
  public listAllrequest = async (user: User) => {
    try {
      const list = await knex.raw(Queries.LIST_OF_REQUESTS, {
        status: "pending",
        requested_id: user.id,
      });
      return { success: true, status: 200, data: list.rows };
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, false, "Could not Load the requests.");
    }
  };

  /**
   * Service Method used to Edit the request status from pending to accepted,cancel or reject.
   */
  public editRequestStatus = async (inputData: EditRequest, user: User) => {
    try {
      console.log("user : ", user);
      const queryObj = {
        id: inputData.id,
        requested_id: user.id,
      };
      const updateStatus = await knex(Tables.REQUESTS)
        .update({ status: inputData.status, update_time: new Date() })
        .where(queryObj)
        .returning("*");

      if (updateStatus.length > 0) {
        if (
          inputData.status === app_constant.REJECT ||
          inputData.status === app_constant.CANCEL
        ) {
          //Will not make friend to each other
          return {
            success: true,
            status: 200,
            message: `Request has been ${inputData.status}`,
          };
        } else if (inputData.status === app_constant.ACCEPT) {
          //make both of them as a friend
          const create_time = new Date();
          const update_time = create_time;
          let friendObj = {
            user_id: updateStatus[0].requester_id,
            friend_id: updateStatus[0].requested_id,
            create_time: create_time,
            update_time: update_time,
          };
          const addFriend = await knex(Tables.FRIENDS).insert(friendObj);
          return {
            success: true,
            status: 200,
            message: `Request ${updateStatus[0].status}`,
          };
        } else {
          throw new HttpException(401, false, "Could not Change Status .");
        }
      } else {
        throw new HttpException(401, false, "Invalid request");
      }
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };

  /**
   * Service Method used to add the post
   */
  public addPost = async (post: Post, user: User) => {
    try {
      const create_time = new Date();
      const postobj = {
        post: post.post,
        user_id: user.id,
        create_time: create_time,
        update_time: create_time,
      };
      const postRes = await knex(Tables.POST).insert(postobj).returning("*");
      if (postRes.length > 0) {
        return {
          success: true,
          status: 200,
          message: "Post Created successfully.",
          data: postRes[0],
        };
      }
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };

  /**
   * Service Method used to add the post
   */
  public removePost = async (id: number, user: User) => {
    try {
      const removePostRes = await knex(Tables.POST)
        .update({ deleted: true, update_time: new Date() })
        .where({ id: id, user_id: user.id });
      return {
        success: true,
        status: 200,
        message: `Post ${id} have been Deleted Successfully.`,
      };
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };

  /**
   * Service Method used to add the post
   */
  public removeFriend = async (id: number, user: User) => {
    try {
      const removePostRes = await knex(Tables.FRIENDS)
        .update({ unfriend: true, update_time: new Date() })
        .where({ user_id: user.id, friend_id: id })
        .returning("*");
      return {
        success: true,
        status: 200,
        data: removePostRes[0],
        message: `Friend (${id}) have been removed From you friend list Successfully.`,
      };
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };


   /**
   * Service Method used to get Friends List
   */
  public getFriendList = async (user: User) => {
    try {
     const friendList = await knex(Tables.FRIENDS).select('*').where({user_id:user.id,unfriend:false});
      return { success:true,status:200,data:(friendList.length > 0)? friendList : "Friends not Found."};
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };


  
   /**
   * Service Method used to get Friends of Friends List
   */
  public getFriendofFriendsList = async (id:number,user: User) => {
    try {
     const friendList = await knex.raw(Queries.FRIEND_OF_FRIENDS,{user_id:user.id,friend_id:id});
      return { success:true,status:200,data:(friendList.length > 0)? friendList : "Friends not Found."};
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };



  /**
   * Service Method used to get Mutual Friends List
   */
  public getFMutualFriendsList = async (id:number,user: User) => {
    try {
     const friendList = await knex.raw(Queries.MUTUAL_FRIENDS,{user_id:user.id,friend_id:id});
      return { success:true,status:200,data:(friendList.length > 0)? friendList : "Friends not Found."};
    } catch (e) {
      this.logger.error("-------- Error : ", e);
      throw new HttpException(401, e.status, e.message);
    }
  };


}
