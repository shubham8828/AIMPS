import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import React, { lazy, Suspense } from "react";
const Section1 = lazy(() => import("../Component/Section/Section1"));
const Section2 = lazy(() => import("../Component/Section/Section2"));
const Section3 = lazy(() => import("../Component/Section/Section3"));
const Section4 = lazy(() => import("../Component/Section/Section4"));
const Section5 = lazy(() => import("../Component/Section/Section5"));
const Section6 = lazy(() => import("../Component/Section/Section6"));
const Section7 = lazy(() => import("../Component/Section/Section7"));
// import Section1 from '../Component/Section/Section1';
// import Section2 from '../Component/Section/Section2';
// import Section3 from '../Component/Section/Section3';
// import Section4 from '../Component/Section/Section4';
// import Section5 from '../Component/Section/Section5';
// import Section6 from '../Component/Section/Section6';
// import Section7 from '../Component/Section/Section7';

const LandingPage = () => {
  const navigate = useNavigate();
  const getStart = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="homeContainer">
        <button onClick={getStart}> Try Now</button>
      </div>

      <div className="line-chart">
        <Suspense fallback={<div>Loading...</div>}>
          <Section1 />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Section2 />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Section3 />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Section4 />
        </Suspense>
        <Section5 />
        <Suspense fallback={<div>Loading...</div>}>
          <Section6 />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Section7 />
        </Suspense>
      </div>
    </>
  );
};

export default LandingPage;
