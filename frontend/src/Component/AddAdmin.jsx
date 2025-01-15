import React, { useState, useRef } from "react";
import defaultProfile from "../asset/logo.png"; // Replace with the path to your default profile image
import axios from "axios";
import ImageCompressor from "image-compressor.js"; // For image compression
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../Component/Spinner.jsx";
import "./AuthForm.css";

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shopname: "N/A",
    email: "",
    phone: "",
    password: "",
    image: defaultProfile,
    address: {
      localArea: "N/A",
      city: "N/A",
      state: "N/A",
      country: "N/A",
      pin: "N/A",
    },
    role: "admin",
  });

  const navigate = useNavigate();
  const imageRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      new ImageCompressor(files[0], {
        quality: 0.6,
        success: (compressedResult) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setFormData({ ...formData, image: fileReader.result });
          };
          fileReader.readAsDataURL(compressedResult);
        },
        error(e) {
          console.log(e.message);
        },
      });
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        shopname: formData.shopname || "N/A",
        address: {
          ...formData.address,
          localArea: formData.address.localArea || "N/A",
          city: formData.address.city || "N/A",
          state: formData.address.state || "N/A",
          country: formData.address.country || "N/A",
          pin: formData.address.pin || "N/A",
        },
        role: "admin",
      };

      const url = "http://localhost:4000/api/register";

      axios.post(url, payload);
      toast.success("Admin Added Successfully ", { position: "top-center" });
      setFormData({
        name: "",
        shopname: "N/A",
        email: "",
        phone: "",
        password: "",
        image: defaultProfile,
        address: {
          localArea: "N/A",
          city: "N/A",
          state: "N/A",
          country: "N/A",
          pin: "N/A",
        },
        role: "admin",
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
      navigate("/admins");
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="main-container">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
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
              autoComplete="name"
            />
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
              autoComplete="email"
            />
          </div>

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
              autoComplete="tel"
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
              minLength={6}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="addAdmin">
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
