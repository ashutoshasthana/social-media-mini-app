// Express route controllers for all the endpoints of the app
import { Router } from 'express';
// import auth from './routes/auth';
import user from './routes/user';
import login from './routes/login';

//import agendash from './routes/agendash';

// guaranteed to get dependencies
export default () => {	
    const app = Router();    
	//auth(app);
	user(app);
	login(app);

	return app
}