import React from 'react'
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Section = () => {
    const navigate = useNavigate();
    const getStart = () => {
        navigate("/login");
      };

  return (
    <div className="homeContainer">
        <button onClick={getStart}> Try Now</button>
    </div>
  )
}

export default Section;