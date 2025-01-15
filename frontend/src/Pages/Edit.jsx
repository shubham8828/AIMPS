import React, {useState, useRef } from 'react';
import axios from 'axios';
import ImageCompressor from 'image-compressor.js'; // For image compression
import toast from 'react-hot-toast';
import Spinner from "../Component/Spinner";
import { useLocation ,useNavigate} from 'react-router-dom';

import './Profile.css'
const Profile = () => {
  const location=useLocation();

  const [user, setUser] = useState(location.state||{}); // Store user data
  const [formData, setFormData] = useState(location.state||{}); // Store form data
  const imageRef = useRef(); 
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

 

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
    setLoading(true);
    try {
      await axios.put('http://localhost:4000/api/update', formData, { headers });
      toast.success('Profile updated successfully', { position: 'top-center' });
      
    } catch (error) {
      toast.error('Failed to update profile', { position: 'top-center' });
    }
    finally{
      setLoading(false);
      navigate('/admins')
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click();
  };

  if (!user || loading) {
    return <Spinner />;
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
                minLength={1}
                maxLength={80}
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
                style={{textTransform:'lowercase'}}
                readOnly
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
                maxLength={10}
                minLength={10}
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
                style={{textTransform:'capitalize'}}
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
                style={{textTransform:'capitalize'}}
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
                style={{textTransform:'capitalize'}}
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
                style={{textTransform:'capitalize'}}
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
                maxLength={6}
                minLength={6}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="submit-btn">
          {loading && <ImSpinner3 />} Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
