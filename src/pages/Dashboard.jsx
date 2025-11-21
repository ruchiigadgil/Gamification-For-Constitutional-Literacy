import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [user, setUser] = useState(null);
  // Start empty so UI reflects server data after first fetch
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [updatingScore, setUpdatingScore] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("User loaded:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    // Fetch authoritative user data from server (if token available)
    const fetchVerify = async () => {
      try {
        const rawToken = localStorage.getItem("token");
        if (!rawToken) return;
        // backend expects 'Authorization: Bearer <token>' or the raw token depending on implementation
        const authHeader = rawToken.startsWith("Bearer")
          ? rawToken
          : `Bearer ${rawToken}`;
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          headers: { Authorization: authHeader },
        });
        if (!res.ok) {
          console.warn("verify failed", res.status);
          return;
        }
        const json = await res.json();
        if (json?.success && json.user) {
          setUser(json.user);
          // persist latest snapshot locally for other components
          localStorage.setItem("user", JSON.stringify(json.user));
        }
      } catch (err) {
        console.error("Error fetching verify:", err);
      }
    };

    // Fetch leaderboard from server
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/auth/leaderboard");
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && Array.isArray(json.entries)) {
          // Map entries into expected shape for UI
          setLeaderboard(
            json.entries.map((e, idx) => ({
              rank: e.rank ?? idx + 1,
              name: e.name,
              score: e.xp ?? e.score ?? 0,
              id: e.id || e.userId || e._id,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    // Listen for updates dispatched from other components (e.g., game score updates)
    const onUserUpdate = (e) => {
      // When other components dispatch user:update, re-fetch authoritative user and leaderboard from server
      fetchVerify();
      fetchLeaderboard();
    };
    const onPending = () => setUpdatingScore(true);
    const onDone = () => setUpdatingScore(false);

    window.addEventListener("user:update", onUserUpdate);
    window.addEventListener("user:update:pending", onPending);
    window.addEventListener("user:update:done", onDone);

    // run once on mount to get latest user xp and leaderboard from server
    fetchVerify();
    fetchLeaderboard();

    // Poll leaderboard periodically so the UI reflects updates made by other users
    // (consumer updates leaderboard_cache in MongoDB; the frontend needs to poll
    // or use websockets/SSE to get real-time pushes). Polling every 10s is a
    // lightweight default for development.
    const pollInterval = 10000; // ms
    const pollId = setInterval(() => {
      fetchLeaderboard();
    }, pollInterval);

    return () => {
      window.removeEventListener("user:update", onUserUpdate);
      window.removeEventListener("user:update:pending", onPending);
      window.removeEventListener("user:update:done", onDone);
      clearInterval(pollId);
    };
  }, []);

  // Menu items shown in the left column of the dashboard
  const menuItems = [
    {
      id: "nlp",
      title: "AI Chat-Bot",
      description: "Ask all your Constitution related doubts here",
      icon: "💬",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      path: "/nlp",
    },
    {
      id: "games",
      title: "Games",
      description: "Interactive Constitutional Games",
      icon: "🎮",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      path: "/games",
    },
    {
      id: "articles",
      title: "Articles",
      description: "Test your Constitutional Knowledge",
      icon: "📋",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      path: "/articleSection",
    },
    {
      id: "about",
      title: "About Us",
      description: "Learn more about InConQuest",
      icon: "ℹ️",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      path: "/about",
    },
    {
      id: "books",
      title: "Books Ref",
      description: "Constitutional Reference Books",
      icon: "📚",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      path: "/books",
    },
    {
      id: "daily",
      title: "Daily Consti-Word",
      description: "Daily Word Challenge",
      icon: "📝",
      color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      path: "/daily",
    },
  ];

  const handleNavigation = (path) => {
    // Replace with actual React Router navigation
    window.location.href = path;
  };

  const dashboardStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: "40px 20px",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "60px",
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "16px",
    textShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };

  const subtitleStyle = {
    fontSize: "1.2rem",
    color: "#64748b",
    fontWeight: "400",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gap: "25px",
    padding: "20px 0",
    maxWidth: "1000px",
    margin: "0 auto",
  };

  // Layout styles for two-column dashboard (menu left, leaderboard right)
  const twoColumnStyle = {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const leftColumnStyle = {
    flex: "1 1 560px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  };

  const rightColumnStyle = {
    flex: "0 0 340px",
  };

  const leaderboardCardStyle = {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(2,6,23,0.08)",
    border: "1px solid rgba(102,118,234,0.08)",
  };

  const leaderboardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  };

  const leaderboardItemStyle = (idx) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "12px",
    background: idx % 2 === 0 ? "transparent" : "rgba(99,102,241,0.03)",
  });

  const avatarStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "0.95rem",
  };

  const rankStyle = {
    fontSize: "0.95rem",
    fontWeight: 800,
    color: "#1f2937",
    width: "28px",
    textAlign: "center",
  };

  const yourScoreCardStyle = {
    marginTop: "18px",
    borderRadius: "14px",
    padding: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };

  const yourScoreBtnStyle = {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    fontWeight: 800,
    cursor: "default",
    boxShadow: "0 12px 28px rgba(102,118,234,0.15)",
    width: "100%",
    textAlign: "center",
    fontSize: "1rem",
  };

  const userScore = user?.score ?? user?.xp ?? 0;

  const getCardStyle = (item, isHovered) => ({
    background: isHovered ? item.color : "rgba(255, 255, 255, 0.9)",
    borderRadius: "20px",
    padding: "30px 25px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: isHovered
      ? "translateY(-8px) scale(1.02)"
      : "translateY(0) scale(1)",
    boxShadow: isHovered
      ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.08)"
      : "0 6px 20px rgba(0, 0, 0, 0.08)",
    border: isHovered ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
  });

  const cardContentStyle = {
    position: "relative",
    zIndex: 2,
  };

  const iconStyle = (isHovered) => ({
    fontSize: "2.5rem",
    marginBottom: "16px",
    display: "block",
    transition: "all 0.3s ease",
    transform: isHovered ? "scale(1.2) rotate(5deg)" : "scale(1) rotate(0deg)",
    filter: isHovered ? "drop-shadow(0 6px 12px rgba(0,0,0,0.3))" : "none",
  });

  const cardTitleStyle = (isHovered) => ({
    fontSize: "1.5rem",
    fontWeight: "700",
    color: isHovered ? "white" : "#1e293b",
    marginBottom: "10px",
    transition: "all 0.3s ease",
  });

  const cardDescriptionStyle = (isHovered) => ({
    fontSize: "0.9rem",
    color: isHovered ? "rgba(255, 255, 255, 0.9)" : "#64748b",
    fontWeight: "400",
    lineHeight: "1.5",
    transition: "all 0.3s ease",
  });

  const shimmerStyle = {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transition: "left 0.6s ease",
    zIndex: 1,
  };

  const keyframes = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={dashboardStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>InConQuest</h1>
            {user && (
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "#64748b",
                  fontWeight: "500",
                  marginTop: "10px",
                }}
              >
                Welcome back,{" "}
                <span style={{ color: "#667eea", fontWeight: "700" }}>
                  {user.fullName}
                </span>
                ! 👋
              </p>
            )}
          </div>

          <div style={twoColumnStyle}>
            <div style={leftColumnStyle}>
              {menuItems.map((item, index) => {
                const isHovered = hoveredCard === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      ...getCardStyle(item, isHovered),
                      width: "100%",
                      animation: `slideInUp 0.6s ease-out ${
                        index * 0.05
                      }s both`,
                    }}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.id === "daily" && user?.dailyWordCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#6aaa64",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                          boxShadow: "0 4px 12px rgba(106, 170, 100, 0.4)",
                          zIndex: 10,
                          animation: "pulse 2s infinite",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    <div style={cardContentStyle}>
                      <span style={iconStyle(isHovered)}>{item.icon}</span>
                      <h3 style={cardTitleStyle(isHovered)}>{item.title}</h3>
                      <p style={cardDescriptionStyle(isHovered)}>
                        {item.description}
                      </p>
                    </div>
                    {isHovered && (
                      <div
                        style={{
                          ...shimmerStyle,
                          left: "100%",
                        }}
                      ></div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-50%",
                        width: "200%",
                        height: "200%",
                        background: `conic-gradient(from 0deg, ${item.color})`,
                        opacity: isHovered ? 0.1 : 0,
                        transition: "all 0.4s ease",
                        borderRadius: "50%",
                        zIndex: 0,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            <div style={rightColumnStyle}>
              <div style={leaderboardCardStyle}>
                <div style={leaderboardHeaderStyle}>
                  <h3
                    style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}
                  >
                    Leaderboard
                  </h3>
                  <small style={{ color: "#64748b" }}>Top 5</small>
                </div>
                <div>
                  {leaderboard.slice(0, 5).map((p, idx) => (
                    <div key={p.rank} style={leaderboardItemStyle(idx)}>
                      <div style={rankStyle}>{p.rank}</div>
                      <div style={avatarStyle}>
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          Score: {p.score}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: "#0f172a" }}>
                        {p.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={yourScoreCardStyle}>
                <button
                  style={{
                    ...yourScoreBtnStyle,
                    opacity: updatingScore ? 0.8 : 1,
                    cursor: updatingScore ? "wait" : "default",
                  }}
                  disabled={updatingScore}
                >
                  {updatingScore ? "Updating..." : `Your Score: ${userScore}`}
                </button>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div
            style={{
              marginTop: "80px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "24px",
              padding: "40px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
              maxWidth: "800px",
              margin: "80px auto 0",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "40px",
              }}
            >
              Your Learning Journey
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "25px",
              }}
            >
              {[
                { label: "Quizzes Completed", value: "42", color: "#667eea" },
                { label: "Badges Earned", value: "12", color: "#f093fb" },
                { label: "Days Streak", value: "8", color: "#43e97b" },
                { label: "XP Points", value: "3500", color: "#4facfe" },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: "center",
                    padding: "20px 15px",
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}25)`,
                    border: `2px solid ${stat.color}30`,
                    transition: "all 0.3s ease",
                    animation: `float 3s ease-in-out infinite ${index * 0.5}s`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: stat.color,
                      marginBottom: "8px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
