import React from 'react'
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import img from '../../asset/image.png'
const Section = () => {
    const navigate = useNavigate();
    const getStart = () => {
        navigate("/login");
      };

  return (
    <div className="landingPage" style={{height:'100vh'}}>
        <img src={img} alt="" />
        <button onClick={getStart}> Try Now</button>
    </div>
  )
}

export default Section;