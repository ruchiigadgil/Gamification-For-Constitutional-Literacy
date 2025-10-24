"use client"
import { NavLink } from "react-router-dom"
import { FaHome, FaComments, FaGamepad, FaBook, FaInfoCircle, FaBookOpen, FaUserTie, FaBars } from "react-icons/fa"
import "./Sidebar.css"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">InConQuest</h2>
        
      </div>

      <div className="sidebar-content">
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaHome className="icon" />
              <span className="link-text">Home (Profile)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/nlp" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaComments className="icon" />
              <span className="link-text">NLP</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/games" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaGamepad className="icon" />
              <span className="link-text">Games</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/articleSection" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaBook className="icon" />
              <span className="link-text">Learning Quiz</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaInfoCircle className="icon" />
              <span className="link-text">About Us</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaBookOpen className="icon" />
              <span className="link-text">Books Ref</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/lawyers" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUserTie className="icon" />
              <span className="link-text">Connect with Lawyers</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
