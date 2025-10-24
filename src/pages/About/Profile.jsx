import React, { useContext } from "react";
import { ProfileContext } from "./ProfileContext";

function Profile() {
  const { info } = useContext(ProfileContext);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "black",
      color: "#ff99c8",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "20rem",
      margin: "2rem auto",
      border: "4px solid #e4c1f9",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#d0f4de",
    },
    image: {
      width: "8rem",
      height: "8rem",
      objectFit: "cover", // ✅ keeps aspect ratio
      border: "4px solid #a9def9",
      marginBottom: "1rem",
    },
    text: {
      fontSize: "1.125rem",
      fontWeight: "bold",
      color: "#ff99c8",
    },
    links: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.5rem",
    },
    link: {
      textDecoration: "none",
      fontWeight: "bold",
    },
    linkedin: { color: "#a9def9" },
    github: { color: "#e4c1f9" },
    insta: { color: "#d0f4de" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <img src={info.image} alt={info.name} style={styles.image} />
      <p style={styles.text}>
        {info.name}, {info.age}
      </p>
      <div style={styles.links}>
        <a
          href={info.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, ...styles.linkedin }}
        >
          LinkedIn
        </a>
        <a
          href={info.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, ...styles.github }}
        >
          GitHub
        </a>
        <a
          href={info.insta}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, ...styles.insta }}
        >
          Instagram
        </a>
      </div>
    </div>
  );
}

export default Profile;
