import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5002/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f9ff 0%, #e8eaff 50%, #f0f2ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow:
      "0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "40px",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  };

  const subtitleStyle = {
    fontSize: "0.95rem",
    color: "#64748b",
    fontWeight: "400",
  };

  const tabContainerStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "35px",
    background: "rgba(248, 249, 255, 0.6)",
    padding: "6px",
    borderRadius: "14px",
    border: "1px solid rgba(99, 102, 241, 0.1)",
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: active
      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
      : "transparent",
    color: active ? "white" : "#64748b",
    boxShadow: active ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
  });

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#1e293b",
  };

  const inputContainerStyle = {
    position: "relative",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid rgba(99, 102, 241, 0.15)",
    borderRadius: "12px",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    outline: "none",
    background: "rgba(248, 249, 255, 0.5)",
    color: "#1e293b",
    boxSizing: "border-box",
  };

  const passwordToggleStyle = {
    position: "absolute",
    right: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#64748b",
    padding: "0",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    background: loading
      ? "#94a3b8"
      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    marginTop: "10px",
  };

  const errorStyle = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    marginBottom: "20px",
    textAlign: "center",
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "0.9rem",
    color: "#64748b",
  };

  const linkStyle = {
    color: "#6366f1",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "color 0.3s ease",
  };

  const inputFocusStyle = `
    input:focus {
      border-color: #6366f1 !important;
      background: white !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4) !important;
    }
    a:hover {
      color: #4f46e5;
    }
  `;

  return (
    <>
      <style>{inputFocusStyle}</style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Create Account</h1>
          </div>

          <div style={tabContainerStyle}>
            <button style={tabStyle(false)} onClick={() => navigate("/login")}>
              Login
            </button>
            <button style={tabStyle(true)}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div style={errorStyle}>{error}</div>}

            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="John Doe"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <div style={inputContainerStyle}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  style={passwordToggleStyle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={inputContainerStyle}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  style={passwordToggleStyle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div style={footerStyle}>
            Already have an account?{" "}
            <a
              href="#"
              style={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login here
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
