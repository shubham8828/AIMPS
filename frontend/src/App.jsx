import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";


import Navbar from "./Component/Navbar.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Contact from "./Pages/Contact.jsx";
import Invoices from "./Pages/Invoices.jsx";
import NewInvoices from "./Pages/NewInvoices.jsx";
import Profile from './Pages/Profile.jsx';
import AuthForm from "./Component/AuthForm.jsx";
import Home from "./Pages/Home.jsx";
import InvoiceDetails from "./Component/InvoiceDetails.jsx";
import About from "./Pages/About.jsx";
import Footer from "./Pages/Footer.jsx";
import Payment from "./Pages/Payment.jsx";
import PaymentList from "./Pages/PaymentList.jsx";
import Message from "./Pages/Message.jsx";
import Users from './Pages/Users.jsx'
import Admins from "./Pages/Admins.jsx";
import AddAdmin from "./Component/AddAdmin.jsx";
import Team from "./Pages/Team.jsx";
import Edit from './Pages/Edit.jsx'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Check localStorage for token on component mount (or page reload)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      
    }
  }, []);

  // PrivateRoute component to protect specific routes
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Navbar setToken={setToken}>
        <Routes>
          <Route path="/" element={!token ? <LandingPage/> : <Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/login" element={<AuthForm setToken={setToken} />} />
          <Route path="/register" element={<AuthForm setToken={setToken} />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home/>
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users/>
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute>
                <Admins/>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <PrivateRoute>
                <AddAdmin/>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit"
            element={
              <PrivateRoute>
                <Edit/>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/edit"
            element={
              <PrivateRoute>
                <Edit/>
              </PrivateRoute>
            }
          />

          <Route
            path="/new-invoice"
            element={
              <PrivateRoute>
                <NewInvoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice-details"
            element={
              <PrivateRoute>
                <InvoiceDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Payment/>
              </PrivateRoute>
            }
          />
          <Route
            path="/payment-details"
            element={
              <PrivateRoute>
                <PaymentList/>
              </PrivateRoute>
            }
          />
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <Message/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Navbar>
      <Footer/>

    </BrowserRouter>
  );
};

export default App;
