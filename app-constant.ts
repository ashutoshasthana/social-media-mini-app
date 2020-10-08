
//Table Enum Constant
export enum Tables {
    USERS = "users", 
    ACCOUNTS = "accounts" ,
    REQUESTS = "requests",
    FRIENDS = 'friends',
    POST = "posts",

 
  }

  //Query  Constant
  export enum Queries {
   LIST_OF_REQUESTS = "select *from requests where status=:status and requested_id=:requested_id", 
   MUTUAL_FRIENDS= `select * from friends 
   where friend_id in (
   select friend_id from friends 
     where user_id = :user_id
     and friend_id not in (:friend_id)
     and unfriend = false)
   and user_id = :friend_id
   and unfriend = false`,

   FRIEND_OF_FRIENDS=`
   select * from friends 
    where user_id = :friend_id and friend_id not in (:user_id)
   and unfriend = false;`
  }

const app_constant =  {
// APP SPECIFIC CONSTANTS
    DEVELOPMENT : "development" ,
    PENDING:"pending",
    ACCEPT:"accepted",
    REJECT:"reject",
    CANCEL:"cancel"
}


export default  app_constant ;