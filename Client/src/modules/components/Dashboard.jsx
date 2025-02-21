
import { useState, useEffect } from "react";
import "./Dashboard.css";



const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [formData, setFormData] = useState([])
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePage, setActivePage] = useState("department");
  const [viewStaff, setViewStaff] = useState(null); // For staff details view
  const [isEditing, setIsEditing] = useState(false);

  
  
  useEffect(()=>{
    setTimeout(() => {
        setSuccess("")
        setError("")
    }, 1500);
  },[success,error])

  // Fetch departments
  useEffect(() => {
    fetchDepartments();
    fetchStaff();

  }, []);
  

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/show_department`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch departments");
      }
      setDepartments(data.department);
    } catch (err) {
      setError(err.message);
    }
  };

  
const fetchStaff = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/department/all_staff`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      
      const data = await response.json();
      
      // Log the response to check if we are receiving the expected data
      console.log("Fetched staff data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch staff");
      }
      
      setStaffData(data.staff_data); // Assuming `staff_data` is returned in the response
    } catch (err) {
      setError(err.message);
    }
  };
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding new department
  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/department_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add department");
      }
      setSuccess("Department added successfully!");
      fetchDepartments();
      setFormData({ deptName: "", deptHead: "", deptType: "educational" });
      setActivePage("department");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle adding new staff

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Ensure all required fields are set in formData
    const { firstName, lastName, email, phone, position, deptId } = formData;
  
    // Check if any required fields are missing
    if (!firstName || !lastName || !email || !phone || !position || !deptId) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/department/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData), // Send the full form data
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add staff");
      }
  
      setSuccess("Staff added successfully!");
      setActivePage("staff")
      fetchStaff()
      setFormData({ firstName: "", lastName: "", email: "", phone: "", position: "", deptId: "" });
      // You may want to update staff list or handle further actions after successful submission
    } catch (err) {
      setError(err.message);
    }
  };
  


  // Handle staff details view
  const handleViewStaff = (staffId) => {
    const staff = staffData.find((staff) => staff.id === staffId);
    setViewStaff(staff);
    setActivePage("view-staff");
  };

  // Handle staff update
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/department/${viewStaff.id}/update_staff`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update staff");
      }
      setSuccess("Staff updated successfully!");
      fetchStaff();
      setIsEditing(false);
      setViewStaff(null);
      setActivePage("staff");
      setFormData('')
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/department/${id}/delete_staff`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete staff");
      }
      setSuccess("Staff deleted successfully!");
      fetchStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-container">
    <div className="dashboard-container">
      <nav className="navbar">
        <button onClick={() => setActivePage("department")}>Department</button>
        <button onClick={() => setActivePage("staff")}>Staff</button>
        <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>Logout</button>
      </nav>

      {/* Department page */}
      {activePage === "department" && (
        <div>
          <h2>Departments</h2>
          <button className="add-btn" onClick={() => setActivePage("add-department")}>Add Department</button>
          <div className="department-list">
            <h3>Department List</h3>
            <ul>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <li key={dept.id}>
                    <strong>{dept.deptName}</strong> - {dept.deptHead} ({dept.deptType})
                  </li>
                ))
              ) : (
                <p>No departments available</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Add Department form */}
      {activePage === "add-department" && (
        <div className="popup-page">
          <h3>Add Department</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleDeptSubmit}>
            <div className="form-group">
              <label>Department Type</label>
              <select name="deptType" value={formData.deptType} onChange={handleChange} required>
                <option value="">Select an option</option>
                <option value="Educational">Educational</option>
                <option value="Hospital">Hospital</option>
                <option value="Industry">Industry</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department Name</label>
              <input type="text" name="deptName" value={formData.deptName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department Head</label>
              <input type="text" name="deptHead" value={formData.deptHead} onChange={handleChange} required />
            </div>
            <button type="submit" className="add-btn">Add Department</button>
            <button type="button" className="close-btn" onClick={() => setActivePage("department")}>Cancel</button>
          </form>
        </div>
      )}

      {/* Staff page */}
      {activePage === "staff" && (
        <div>
          <h2>Staff</h2>
          <button className="add-btn" onClick={() => setActivePage("add-staff")}>Add Staff</button>
          <div className="staff-list">
            <h3>Staff List</h3>
            <ul>
              {staffData.length > 0 ? (
                staffData.map((staff) => (
                  <li key={staff.id}>
                    <strong>{staff.firstName} {staff.lastName}</strong> - {staff.position}
                    <button onClick={() => handleViewStaff(staff.id)}>View</button>
                    <button onClick={() => handleDeleteStaff(staff.id)}>Delete</button>
                  </li>
                ))
              ) : (
                <p>No staff available</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Add Staff form */}
      {activePage === "add-staff" && (
        <div className="popup-page">
          <h3>Add Staff</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleStaffSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select name="deptId" value={formData.deptId} onChange={handleChange} required>
                <option value="">Select an option</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-btn" >Add Staff</button>
            <button type="button" className="close-btn" onClick={() => setActivePage("staff")}>Cancel</button>
          </form>
        </div>
      )}

      {/* View Staff page */}
      {activePage === "view-staff" && viewStaff && (
  <div className="popup-page">
    <h3>Staff Details</h3>
    <div className="staff-details">
      <p><strong>Name:</strong> {viewStaff.firstName} {viewStaff.lastName}</p>
      <p><strong>Email:</strong> {viewStaff.email}</p>
      <p><strong>Phone:</strong> {viewStaff.phone}</p>
      <p><strong>Position:</strong> {viewStaff.position}</p>
      <p><strong>Department:</strong> {viewStaff.department ? viewStaff.department.deptName : "No department assigned"}</p>
    </div>
    <button onClick={() => setIsEditing(true)}>Edit</button>
    <button onClick={() => setActivePage("staff")}>Back</button>
  </div>
)}

      {/* {activePage === "view-staff" && viewStaff && (
        <div className="popup-page">
          <h3>Staff Details</h3>
          <div className="staff-details">
            <p><strong>Name:</strong> {viewStaff.firstName} {viewStaff.lastName}</p>
            <p><strong>Email:</strong> {viewStaff.email}</p>
            <p><strong>Phone:</strong> {viewStaff.phone}</p>
            <p><strong>Position:</strong> {viewStaff.position}</p>
            <p><strong>Department:</strong> {viewStaff.department.deptName}</p>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => setActivePage("staff")}>Back</button>
        </div>
      )} */}

      {/* Edit Staff page */}
      {isEditing && (
        <div className="popup-page">
          <h3>Edit Staff</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleUpdateStaff}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required />
            </div>
            
            <button type="submit" className="add-btn">Save Changes</button>
            <button type="button" className="close-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
