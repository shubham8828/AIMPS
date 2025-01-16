import React, { useState, useRef } from "react";
import defaultProfile from "../asset/logo.png"; // Replace with the path to your default profile image
import user from "../asset/user.png"; // Replace with the path to your default profile image
import axios from "axios";
import ImageCompressor from "image-compressor.js"; // For image compression
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register forms
  const [formData, setFormData] = useState({
    name: "",
    shopname: "",
    email: "",
    phone: "",
    password: "",
    image: defaultProfile, // Default profile image
    address: {
      localArea: "",
      city: "",
      state: "",
      country: "",
      pin: "",
    },
    role: "user",
  });
  const navigate = useNavigate();
  const imageRef = useRef(); // useRef for image input

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      // Compress the image before setting it to state
      new ImageCompressor(files[0], {
        quality: 0.6,
        success: (compressedResult) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setFormData({ ...formData, image: fileReader.result }); // Update image with the compressed one
          };
          fileReader.readAsDataURL(compressedResult);
        },
        error(e) {
          console.log(e.message);
        },
      });
    } else if (name.startsWith("address.")) {
      // Update address fields
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData; // Send entire formData for registration

      const url = isLogin
        ? "http://localhost:4000/api/login"
        : "http://localhost:4000/api/register";

      const { data } = await axios.post(url, payload);

      // console.log( data.user.role)
      localStorage.setItem("token", data.token);

      setToken(data.token);
      toast.success(data.msg, { position: "top-center" });

      setFormData({
        name: "",
        shopname: "",
        email: "",
        phone: "",
        password: "",
        image: defaultProfile,
        address: { localArea: "", city: "", state: "", country: "", pin: "" },
        role: "user",
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred", {
        position: "top-center",
      });
    } finally {
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click(); // Trigger image file input click
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <div className="auth-container">
          <div className="form-toggle">
            <button
              className={`toggle-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`toggle-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                {/* Image Input */}
                <div className="form-group">
                  <h2 style={{ textAlign: "center" }}>Profile Image</h2>
                  <div className="profile-image">
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="profile-pic"
                      onClick={triggerImageUpload}
                    />
                  </div>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleChange}
                    ref={imageRef}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Name Input */}
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shopname">Shop/Company Name</label>
                  <input
                    type="text"
                    name="shopname"
                    id="shopname"
                    value={formData.shopname}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Input */}
                <div className="form-group">
                  <label htmlFor="phone">Mobile No.</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, "");
                      if (inputValue.length <= 10) {
                        setFormData({ ...formData, phone: inputValue });
                      }
                    }}
                    required
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                {/* Address Inputs */}
                <div className="form-group">
                  <label htmlFor="address.localArea">Local Area</label>
                  <input
                    type="text"
                    name="address.localArea"
                    id="localArea"
                    value={formData.address.localArea}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <input
                    type="text"
                    name="address.city"
                    id="city"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.state">State</label>
                  <input
                    type="text"
                    name="address.state"
                    id="state"
                    value={formData.address.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.country">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    id="country"
                    value={formData.address.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.pin">PIN</label>
                  <input
                    type="text"
                    name="address.pin"
                    id="pin"
                    value={formData.address.pin}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}" // PIN validation
                    maxLength={6}
                  />
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Login Form */}
            {isLogin && (
              <>
                <div className="login-form-icon">
                  <img src={user} alt="" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? " Login" : " Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
