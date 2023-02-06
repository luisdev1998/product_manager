import express from 'express';
import {save,login,confirm,profile,forgetPassword,confirmToken,newPassword} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

//PUBLIC
router.post('/save', save);
router.post('/login', login);
router.get('/confirm/:token', confirm);
router.post('/forgetPassword', forgetPassword)
router.route('/forgetPassword/:token').get(confirmToken).post(newPassword);

//PRIVATE
router.get('/profile', checkAuth, profile);


export default router;