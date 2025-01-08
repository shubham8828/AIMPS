import { TypeAnimation } from "react-type-animation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSun, FaMoon, FaCloudSun, FaCloudMoon } from "react-icons/fa";
import Hero from '../asset/Hero.png'
const Typing = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get("http://localhost:4000/api/user", { headers })
      .then((response) => {
        const { user } = response.data;
        if (user.role === "root" || user.role === "admin") {
          setIsAdmin(true);
        }
        setUser(user);
      })
      .catch((error) => {
        console.log(error);
      });

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const generateMessages = (user) => {
    if (!user) return [];
    return [
      `${greeting} ${user.name}!`,
      `Welcome back, ${user.email}`,
     ];
  };

  const messages = generateMessages(user);

  const getBackgroundAndIcon = () => {
    switch (greeting) {
      case "Good Morning":
        return { background: "#FFD700", icon: <FaSun style={{ fontSize: "6em", marginBottom: "20px" }} /> };
      case "Good Afternoon":
        return { background: "#FFB347", icon: <FaCloudSun style={{ fontSize: "6em", marginBottom: "20px" }} /> };
      case "Good Evening":
        return { background: "#FF6347", icon: <FaCloudMoon style={{ fontSize: "6em", marginBottom: "20px" }} /> };
      case "Good Night":
        return { background: "#2F4F4F", icon: <FaMoon style={{ fontSize: "6em", marginBottom: "20px" }} /> };
      default:
        return { background: "#FFFFFF", icon: null };
    }
  };

  const { background, icon } = getBackgroundAndIcon();

  return (
    <div className="line-chart1">
      <div
        className="welcome-user-container"
        style={{
          backgroundColor: background,
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: !isAdmin ? "100vh" : "80vh",
        }}
      >
        <div className="welcome-left" style={{width:'50%'}}>
          <img src={Hero} alt="" height={400} />
        </div>
        <div className="welcome-right" 
          style={{
          display:'flex', 
          flexDirection:'column', 
          width:'50%',
          alignItems: "center",
          justifyContent: "center"
          }}>
        {user ? (
          <>
            {icon}
            <TypeAnimation
              sequence={[
                ...messages,
                2000,
              ]}
              wrapper="h1"
              speed={50}
              style={{ fontSize: "2em", display: "inline-block", marginTop: "20px" }}
              repeat={Infinity}
            />
          </>
        ) : (
          <h1>Loading...</h1>
        )}
        </div>
      </div>
    </div>
  );
};

export default Typing;
