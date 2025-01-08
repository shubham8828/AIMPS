import React from 'react'
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Section1 from '../Component/Section/Section1';
import Section2 from '../Component/Section/Section2';
import Section3 from '../Component/Section/Section3';
import Section4 from '../Component/Section/Section4';
import Section5 from '../Component/Section/Section5';
import Section6 from '../Component/Section/Section6';
import Section7 from '../Component/Section/Section7';
  

const LandingPage = () => {
    const navigate = useNavigate(); 
    const getStart = () => {
        navigate('/login'); 
    };
  return (<>
      <div className='homeContainer'>
        <button onClick={getStart}> Try Now</button>
      </div>
      
      <div className='line-chart'>
        <Section1/>
        <Section2/>
        <Section3/>
        <Section4/>
        <Section5/>
        <Section6/>
        <Section7/>
      </div>
    </>
  )
}

export default LandingPage