import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons for Edit and Delete
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]); // State to store users data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [userRole, setUserRole] = useState(null); // State to store user role
  const navigate = useNavigate();

  // Fetch users from the API on component mount
  useEffect(() => {
    fetchUsers();
    fetchUserRole();  
  }, []); // Empty dependency array means this runs only once when the component mounts

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.get("http://localhost:4000/api/users", {
        headers,
      });
      setUsers(response.data.users); // Assuming the response has users in `data.users`
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {

    }
  };

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (token) {
        const response = await axios.get("http://localhost:4000/api/user/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data.role); // Assuming the role is in `data.role`
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Handle edit action
  const handleEdit = (user) => {
    navigate("/user/edit", { state: user}); // Pass the email as state
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found'); // Handle missing token
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.delete(`http://localhost:4000/api/deleteuser/${id}`, { headers });
  
      setUsers(users.filter((user) => user._id !== id));
  
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
    }
  };
  
  // Filter users based on search query and role
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      user.role === 'user' &&  // Only include users with the role 'user'
      (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.address?.city?.toLowerCase().includes(query) ||
        user.address?.state?.toLowerCase().includes(query) ||
        user.address?.country?.toLowerCase().includes(query) ||
        user.address?.localArea?.toLowerCase().includes(query) ||
        user.address?.pin?.toString().includes(query) ||
        (users.indexOf(user) + 1).toString().includes(query) // Match Sr No.
      )
    );
  });


  return (
    <div className="line-chart" style={{height:'95vh',width:'93vw'}}>
      {/* Conditionally Show Users Header and Search Bar */}
      {userRole === 'user' && (
        <>
          <h2
            style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}
          >
            Users
          </h2>

          {/* Conditionally Show Search Bar */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search by Name, Email, City, State, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "80%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
        </>
      )}

      {/* No Users Message */}
      {filteredUsers.length === 0 && (
        <div style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>
          No users available
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th style={styles.th}>Sr No.</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>State</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Local Area</th>
                <th style={styles.th}>Pin</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.address?.city || "N/A"}</td>
                  <td style={styles.td}>{user.address?.state || "N/A"}</td>
                  <td style={styles.td}>{user.address?.country || "N/A"}</td>
                  <td style={styles.td}>{user.address?.localArea || "N/A"}</td>
                  <td style={styles.td}>{user.address?.pin || "N/A"}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{ ...styles.button, background: "#4CAF50", width:'30px'  } }
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{
                        ...styles.button,
                        background: "#f44336",
                        width:'30px' ,
                        marginLeft:'10px'
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Inline styles for table and buttons
const styles = {
  th: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "5px 5px",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default Users;
