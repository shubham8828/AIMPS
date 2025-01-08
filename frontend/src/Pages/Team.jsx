import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaBriefcase,
  FaUserTie,
} from "react-icons/fa";
import { SiProbot } from "react-icons/si";

const Team = () => {
  const teamHead = {
    title: "Project Mentor",
    name: "Prof. Vandana Maurya",
    email: "vandanamaurya@gmail.com",
    profession: "Assistant Professor",
    experience: "5+ years",
    
  };

  const teamMembers = [
    {
      title: "Developer",
      name: "Shubham Vishwakarma",
      email: "skv6621@gmail.com",
      profession: "Full Stack Developer",
      github: "https://github.com/shubham8828",
      linkedin: "https://www.linkedin.com/in/shubham-vishwakarma-8b2b06260/",
    },
    {
      title: "Developer",
      name: "Vikas Vishwakarma",
      email: "vikasrv.9922@gmail.com",
      profession: "Software Developer",
      github: "https://github.com/Vikas-922",
      linkedin: "https://www.linkedin.com/in/vikas-vishwakarma-11b686319/",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Project Title */}
      <div style={styles.projectCard}>
        <h1 style={styles.projectTitle}>
          <SiProbot style={styles.icon} /> AIMPS Project
        </h1>
      </div>

      {/* Team Head */}

      <div style={styles.teamSection}>
        <div style={styles.card}>
          <div style={styles.imagePlaceholder}>
            <FaUserTie style={styles.placeholderIcon} />
          </div>
          <h3 style={styles.name}>{teamHead.name}</h3>
          <p style={styles.title}>{teamHead.title}</p>
          <p style={styles.profession}>
            <FaBriefcase style={styles.icon} /> {teamHead.profession}
          </p>
          <p style={styles.experience}>
            <FaBriefcase style={styles.icon} /> {teamHead.experience}
          </p>
          <p style={styles.email}>
            <FaEnvelope style={styles.icon} />{" "}
            <a href={`mailto:${teamHead.email}`} style={styles.link}>
              {teamHead.email}
            </a>
          </p>
          
        </div>
      </div>

      <div style={styles.teamSection}>
        {teamMembers.map((member, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.imagePlaceholder}>
              <FaUserTie style={styles.placeholderIcon} />
            </div>{" "}
            <h3 style={styles.name}>{member.name}</h3>
            <p style={styles.title}>{member.title}</p>
            <p style={styles.profession}>
              <FaBriefcase style={styles.icon} /> {member.profession}
            </p>
            <p style={styles.email}>
              <FaEnvelope style={styles.icon} />{" "}
              <a href={`mailto:${member.email}`} style={styles.link}>
                {member.email}
              </a>
            </p>
            <div style={styles.socialIcons}>
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <FaGithub style={styles.icon} />
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin style={styles.icon} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "95%",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Arial', sans-serif",
    margin: "30px 0px",
  },
  projectCard: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "15px",
    textAlign: "center",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  projectTitle: {
    fontSize: "24px",
    margin: "0",
  },
  teamSection: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginTop: "30px",
  },
  sectionTitle: {
    textAlign: "center",
    margin: "20px 0",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "350px",
    textAlign: "center",
  },
  imagePlaceholder: {
    backgroundColor: "#ddd",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: "50px",
    color: "#aaa",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto 10px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  title: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#777",
    margin: "5px 0",
  },
  profession: {
    fontSize: "14px",
    color: "#555",
    margin: "5px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align content to the left
    gap: "8px", // Add space between icon and text
  },
  experience: {
    fontSize: "14px",
    color: "#555",
    margin: "5px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align content to the left
    gap: "8px", // Add space between icon and text
  },
  email: {
    fontSize: "14px",
    margin: "10px 40px",
    color: "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align content to the left
    gap: "8px", // Add space between icon and text
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  icon: {
    fontSize: "20px",
    color: "#333",
    flexShrink: 0, // Prevent the icon from shrinking
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  icon: {
    fontSize: "20px",
    color: "#333",
  },
};

export default Team;
