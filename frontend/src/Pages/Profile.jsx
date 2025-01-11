import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ImageCompressor from 'image-compressor.js'; // For image compression
import toast from 'react-hot-toast';
import './Profile.css'
const Profile = () => {
  const [user, setUser] = useState(null); // Store user data
  const [formData, setFormData] = useState({}); // Store form data
  const imageRef = useRef(); 

  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/user', { headers });
        setUser(res.data.user);
        setFormData(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
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
          console.error(e.message);
        },
      });
    } else {
      const keys = name.split('.');
      if (keys.length > 1) {
        setFormData({
          ...formData,
          [keys[0]]: { ...formData[keys[0]], [keys[1]]: value },
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/update', formData, { headers });
      toast.success('Profile updated successfully', { position: 'top-center' });
    } catch (error) {
      toast.error('Failed to update profile', { position: 'top-center' });
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isAdminOrRoot = user.role === 'root' || user.role === 'admin';

  return (
    <div className='profile-container'>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {(isAdminOrRoot ? 'Admin' : 'User')} Profile
      </h2>
      <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="image" className="image-label" style={{textAlign:'center'}}>Profile Image</label>
              <div onClick={triggerImageUpload} className="profile-image">
                <img src={formData.image} alt="Profile" className="profile-pic" />
              </div>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleChange}
                ref={imageRef}
                style={{ display: 'none' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,10}$/.test(input)) {
                    handleChange(e);
                  }
                }}
                maxLength="10"
                required
                placeholder="Enter 10-digit phone number"
              />
            </div>
        {!isAdminOrRoot && (
          <>
            {/* Render additional fields for regular users */}
            <div className="form-group">
              <label htmlFor="address.localArea">Local Area</label>
              <input
                type="text"
                name="address.localArea"
                id="address.localArea"
                value={formData.address?.localArea || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                name="address.city"
                id="address.city"
                value={formData.address?.city || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.state">State</label>
              <input
                type="text"
                name="address.state"
                id="address.state"
                value={formData.address?.state || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.country">Country</label>
              <input
                type="text"
                name="address.country"
                id="address.country"
                value={formData.address?.country || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.pin">PIN Code</label>
              <input
                type="text"
                name="address.pin"
                id="address.pin"
                value={formData.address?.pin || ''}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,6}$/.test(input)) {
                    handleChange(e);
                  }
                }}
                maxLength="6"
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="submit-btn"> Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
