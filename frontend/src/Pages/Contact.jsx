import React from "react";
import { FaEnvelope, FaUserAlt, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Contact Us</h1>
            <p style={styles.text}>
                We value your feedback and are here to assist you with any issues or queries. If you encounter any problems, please don't hesitate to reach out to us. 
            </p>
            <p style={styles.text}>
                <FaEnvelope style={styles.icon} /> Email us at:{" "}
                <a href="mailto:aimps24x7@gmail.com" style={styles.link}>aimps24x7@gmail.com</a>
            </p>
            <p style={styles.text}>
                <FaPhone style={styles.icon} /> Customer Support: +91 8828709874 (Available 24x7)
            </p>
            <p style={styles.text}>
                <FaMapMarkerAlt style={styles.icon} /> Office Address: Titwala (East), Kalyan,Thane,Maharastra India 421605
            </p>
            <p style={styles.text}>
                If you'd like to know more about AIMPS and our services, please{" "}
                <FaUserAlt style={styles.icon} />{" "}
                <a href="/login" style={styles.link}>Login</a> or{" "}
                <a href="/register" style={styles.link}>Register</a>. Once logged in, you can explore all our features and services.
            </p>
            <p style={styles.text}>
                To get instant help, go to the sidebar and click on <strong>Message</strong>. In the chat section, you will find two lists on the left side: <strong>Admins</strong> and <strong>Users</strong>. Select <strong>Admins</strong>, choose any admin, and start a conversation to resolve your issue. AIMPS guarantees 100% solutions to all your concerns.
            </p>
            <p style={styles.text}>
                AIMPS is committed to providing the best customer service experience. Whether it's a technical issue, account-related question, or general inquiry, our team is here to assist you. Let us know how we can help you!
            </p>
            <p style={styles.text}>
                Thank you for choosing AIMPS! Your satisfaction is our top priority.
            </p>
        </div>
    );
};

const styles = {
    container: {
        margin:"30px 0px",
        padding: "20px",
        maxWidth: "900px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#333",
    },
    text: {
        fontSize: "16px",
        color: "#555",
        lineHeight: "1.6",
        marginBottom: "15px",
    },
    icon: {
        marginRight: "5px",
        verticalAlign: "middle",
        color: "#333",
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
    },
};

export default Contact;
