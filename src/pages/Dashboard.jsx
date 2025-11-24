import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [user, setUser] = useState(null);
  // Start empty so UI reflects server data after first fetch
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [updatingScore, setUpdatingScore] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null); // badge to show in popup
  const [badgeSyncStatus, setBadgeSyncStatus] = useState(null);

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
      // Replaced About Us block with News (user requested)
      id: "news",
      title: "News",
      description: "Latest updates and announcements",
      icon: "📰",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      path: "/news",
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

  const leaderboardItemStyle = (idx, isCurrent = false) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "12px",
    background: isCurrent
      ? "linear-gradient(90deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))"
      : idx % 2 === 0
      ? "transparent"
      : "rgba(99,102,241,0.03)",
    border: isCurrent ? "1px solid rgba(16,185,129,0.15)" : "none",
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
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    border: "1px solid rgba(2,6,23,0.04)",
    boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
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

  // Badge tiers
  const BADGE_TIERS = [
    {
      key: 'quick_spark',
      title: 'Quick Spark',
      threshold: 50,
      emoji: '⚡',
      short: '⭐ 50 Coins — “Quick Spark” ⚡',
      description: 'You’ve ignited your learning journey with speed and enthusiasm. A small spark that shows big potential ahead.'
    },
    {
      key: 'skill_surfer',
      title: 'Skill Surfer',
      threshold: 100,
      emoji: '🌊',
      short: '🌟 100 Coins — “Skill Surfer” 🌊',
      description: 'You’re riding the wave of knowledge with growing confidence. Each challenge makes you sharper and stronger.'
    },
    {
      key: 'prime_prodigy',
      title: 'Prime Prodigy',
      threshold: 200,
      emoji: '✨',
      short: '💎 200 Coins — “Prime Prodigy” ✨',
      description: 'Your dedication is turning into true mastery. A standout achiever with unstoppable momentum.'
    }
  ];

  // When user's coins change, check for newly earned badges (batch-award)
  const awardedBatchKeyRef = React.useRef(null);
  useEffect(() => {
    if (!user) return;
    const badges = Array.isArray(user.badges) ? user.badges : [];

    // Collect all tiers the user now qualifies for but doesn't yet have
    const newlyEarned = BADGE_TIERS.filter(t => userScore >= t.threshold && !badges.includes(t.key));
    if (!newlyEarned.length) return;

    // Build a stable key so we show the popup only once for this specific batch
    const batchKey = newlyEarned.map(t => t.key).sort().join(',');
    if (awardedBatchKeyRef.current === batchKey) return; // already showed

    // Optimistically update local user snapshot to include new badges
    const newBadgeKeys = newlyEarned.map(t => t.key);
    const updatedUser = { ...user, badges: Array.from(new Set([...(badges || []), ...newBadgeKeys])) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Show a single popup listing all newly awarded badges
    setEarnedBadge({ multiple: true, tiers: newlyEarned });
    awardedBatchKeyRef.current = batchKey;

    // Persist each badge to backend; do them in parallel but continue gracefully if endpoint missing
    (async () => {
      try {
        const rawToken = localStorage.getItem('token');
        if (!rawToken) {
          setBadgeSyncStatus('no-token');
          return;
        }
        const authHeader = rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`;

        // call endpoint for each badge (server $addToSet is idempotent)
        const promises = newBadgeKeys.map(b => fetch('/api/auth/update-badges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({ badge: b })
        }));

        const results = await Promise.allSettled(promises);
        const failed = results.some(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value && !r.value.ok));
        setBadgeSyncStatus(failed ? 'failed' : 'synced');

        // Refresh authoritative user snapshot from server if possible
        try {
          const verifyRes = await fetch('/api/auth/verify', {
            headers: { 'Authorization': authHeader }
          });
          if (verifyRes.ok) {
            const data = await verifyRes.json();
            if (data?.user) {
              localStorage.setItem('user', JSON.stringify({ ...user, ...data.user }));
              setUser({ ...user, ...data.user });
              window.dispatchEvent(new Event('user:update'));
            }
          }
        } catch (e) {
          // ignore verify failure
        }
      } catch (err) {
        console.warn('badge persistence failed (ok to ignore):', err);
        setBadgeSyncStatus('failed');
      }
    })();
  }, [userScore]);

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
          {/* Top-left circular info icon that links to About page */}
          <div
            style={{ position: "absolute", top: 20, left: 20, zIndex: 1500 }}
          >
            <button
              onClick={() => handleNavigation("/about")}
              aria-label="About InConQuest"
              title="About"
              style={{
                width: 90,
                height: 55,
                borderRadius: 30,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#ffffff,#f1f5f9)",
                boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
                cursor: "pointer",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginLeft: "0.7rem",
              }}
            >
              <span style={{ fontWeight: 600, color: "#0f172a" }}>
                About us
              </span>
            </button>
          </div>

          {/* Blur overlay when modal shown */}
          {earnedBadge && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                  borderRadius: 16,
                  padding: 28,
                  maxWidth: 520,
                  width: "90%",
                  boxShadow: "0 30px 80px rgba(2,6,23,0.3)",
                  textAlign: "center",
                }}
              >
                {earnedBadge.multiple ? (
                  <>
                    <div style={{ fontSize: 36 }}>🏅</div>
                    <h2 style={{ marginTop: 8, marginBottom: 6 }}>
                      Congrats — You earned {earnedBadge.tiers.length} new badge
                      {earnedBadge.tiers.length > 1 ? "s" : ""}!
                    </h2>
                    <div
                      style={{
                        color: "#374151",
                        marginBottom: 18,
                        textAlign: "left",
                      }}
                    >
                      {earnedBadge.tiers.map((t) => (
                        <div
                          key={t.key}
                          style={{
                            marginBottom: 12,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                          }}
                        >
                          <div style={{ fontSize: 28 }}>{t.emoji}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{t.short}</div>
                            <div
                              style={{ fontSize: "0.95rem", color: "#475569" }}
                            >
                              {t.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setEarnedBadge(null)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#667eea,#8b5cf6)",
                        color: "white",
                        border: "none",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Great — keep going →
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48 }}>{earnedBadge.emoji}</div>
                    <h2 style={{ marginTop: 8, marginBottom: 6 }}>
                      {earnedBadge.short}
                    </h2>
                    <p style={{ color: "#374151", marginBottom: 18 }}>
                      {earnedBadge.description}
                    </p>
                    <button
                      onClick={() => setEarnedBadge(null)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#667eea,#8b5cf6)",
                        color: "white",
                        border: "none",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Nice! Continue →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Header */}
          <div style={headerStyle}>
            <h1 style={titleStyle}>InConQuest</h1>
            {user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 10,
                }}
              >
                {/* <div style={avatarStyle}>
                  {user.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div> */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div style={{ fontSize: "1rem", color: "#64748b" }}>
                    Welcome back,
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#685FBA",
                      fontSize: "1.2rem",
                    }}
                  >
                    {user.fullName} !👋
                  </div>
                </div>
              </div>
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
                      <div style={{ ...shimmerStyle, left: "100%" }} />
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
                    />
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
                  {leaderboard.slice(0, 5).map((p, idx) => {
                    const currentUserId =
                      user?.id || user?._id || user?._id?.toString();
                    const isCurrent =
                      currentUserId && String(p.id) === String(currentUserId);
                    return (
                      <div
                        key={p.rank}
                        style={leaderboardItemStyle(idx, isCurrent)}
                      >
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
                          <div
                            style={{ fontSize: "0.85rem", color: "#64748b" }}
                          >
                            Coins🪙: {p.score}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: "#0f172a" }}>
                          {p.score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compact user coins row styled like leaderboard */}
              <div style={{ ...yourScoreCardStyle, padding: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                  }}
                >
                  <div style={avatarStyle}>
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>
                      {user?.fullName}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      Your Coins🪙:
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      color: "#0f172a",
                    }}
                  >
                    {userScore}
                  </div>
                </div>
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
                display: "flex",
                gap: "20px",
                alignItems: "stretch",
                justifyContent: "space-between",
              }}
            >
              {/* Daily quiz card - left */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 18px",
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #e6fff5 0%, #f2fff9 100%)",
                  border: "1px solid #d1fae5",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#64748b",
                    marginBottom: 6,
                  }}
                >
                  Daily Quiz Streak:
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#10b981",
                  }}
                >
                  {user?.streak ?? 0}
                </div>
              </div>

              {/* Badges card - middle */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 18px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #f8fafc, #ffffff)",
                  border: "1px solid #e6e9ef",
                }}
              >
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#64748b",
                    marginBottom: 8,
                  }}
                >
                  Your Badges:
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {BADGE_TIERS.map((t) => {
                    const has =
                      Array.isArray(user?.badges) &&
                      user.badges.includes(t.key);
                    return (
                      <div
                        key={t.key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 72,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: has
                              ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                              : "#f1f5f9",
                            boxShadow: has
                              ? "0 8px 20px rgba(99,102,241,0.08)"
                              : "none",
                          }}
                        >
                          <div style={{ fontSize: 24 }}>{t.emoji}</div>
                          <div
                            style={{
                              position: "absolute",
                              bottom: -6,
                              right: -6,
                              width: 22,
                              height: 22,
                              borderRadius: 11,
                              background: has ? "#10b981" : "#e2e8f0",
                              color: has ? "white" : "#94a3b8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                            }}
                          >
                            {has ? "✓" : "🔒"}
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: "0.8rem",
                            color: has ? "#0f172a" : "#94a3b8",
                            fontWeight: 700,
                            textAlign: "center",
                          }}
                        >
                          {t.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coins card - right (learning journey) */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 18px",
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #e6f0ff 0%, #f5f9ff 100%)",
                  border: "1px solid #dbeafe",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#64748b",
                    marginBottom: 6,
                  }}
                >
                  Your Coins
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#4facfe",
                  }}
                >
                  {userScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
