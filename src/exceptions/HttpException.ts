//App level Exceptions
class HttpException extends Error {
    status: number;
    message: string;
    success:boolean;
    constructor(status: number,success:boolean,message: string) {
      super(message);
      this.status = status;
      this.message = message;
      this.success = success;
    }
  }

  export default HttpException;