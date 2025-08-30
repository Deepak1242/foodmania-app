import express from 'express';
import {Signin,Login,Logout} from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/login', Login);
router.post('/signin', Signin);
router.get('/logout', Logout);



export default router;