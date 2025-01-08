import express from 'express';
import AuthenticateToken from '../Middleware/AuthenticateToken.js';
import {
  deleteInvoice,
  invoices,
  newInvoive,
  searchCustomer,
  updateInvoice,
  getUser,
  login,
  register,
  update,
  makePayment,
  newMessages,
  getUserPayments,
  getInvoice,
  getPaymentData,
  getMessages,
  getUsers,
  deleteUser,
  

} from '../controller/Controller.js';

const Routes = express.Router();

Routes.post('/login', login);
Routes.post('/register', register);


Routes.use(AuthenticateToken);
Routes.post('/create', newInvoive);
Routes.get('/invoices', invoices);
Routes.delete('/delete/:id', deleteInvoice);
Routes.get('/user', getUser);
Routes.post('/search', searchCustomer); // for searching customers
Routes.put('/update', update); // update user profile
Routes.put('/updateInvoice', updateInvoice); // updating invoice
Routes.post('/payment', makePayment);
Routes.post('/payment-data', getUserPayments);
Routes.post('/getInvoice', getInvoice);
Routes.post('/getPaymentData', getPaymentData);
Routes.get('/users', getUsers);
Routes.delete('/deleteuser/:id', deleteUser);
Routes.post('/messages', getMessages);
Routes.post('/newmessage', newMessages);


export default Routes;
