import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import rohana from "../images/rohana.png";
import ridhi from "../images/ridhi.jpeg";
import sania from "../images/sania.png";
import ruchi from "../images/ruchi.jpeg";
import { ProfileContext } from "./ProfileContext";

const Team = () => {
  const { setInfo } = useContext(ProfileContext);
  const nav = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Rohana Mahimkar",
      age: 20,
      linkedin: "https://www.linkedin.com/in/rohana-mahimkar-96341a283/",
      github: "https://github.com/rohana-2005",
      insta: "https://www.instagram.com/rohana.m?igsh=ZXhqOGszN2xuMmxu",
      image: rohana,
    },
    {
      id: 2,
      name: "Sania Valiyani",
      age: 20,
      linkedin: "https://www.linkedin.com/in/sania-valiyani-9a714528b/",
      github: "https://github.com/SaniaValiyani",
      insta: "https://www.instagram.com/valiyani_sania_?igsh=eTQ5NTliZDlsaXY5",
      image: sania,
    },
    {
      id: 3,
      name: "Ridhi Agrawal",
      age: 20,
      linkedin: "https://www.linkedin.com/in/ridhi-agrawal-8648b42aa/",
      github: "https://github.com/ridhi607",
      insta: "https://www.instagram.com/_ridhihikbyee",
      image: ridhi,
    },
    {
      id: 4,
      name: "Ruchi Gadgil",
      age: 20,
      linkedin: "https://www.linkedin.com/in/ruchi-gadgil-98099617a/",
      github: "https://github.com/ruchiigadgil",
      insta: "https://www.instagram.com/ruchigadgil?igsh=NmR2amJiaTVsYWtk",
      image: ruchi,
    },
  ];

  return (
    <div className="team-container">
      <h1 className="team-title">Developers Team</h1>
      <div className="team-grid">
        {teamMembers.map((item, index) => (
          <div
            onClick={() => {
              setInfo(item);
              nav("/profile");
            }}
            key={index}
            className="team-card"
          >
            <img src={item.image} alt={item.name} className="team-image" />
            <h2 className="team-name">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

// 👇 inline styles injection
const styles = `
.team-container {
  background-color: #fcf6bd;
  padding: 40px 20px;
  text-align: center;
  min-height: 100vh;
}

.team-title {
  font-size: 36px;
  font-weight: bold;
  color: #ff66b2;
  margin-bottom: 30px;
}

.team-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
}

.team-card {
  background-color: #a9def9;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 220px;
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-6px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}

.team-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.team-name {
  font-size: 20px;
  font-weight: bold;
  color: #114b5f;
  margin-top: 5px;
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);
