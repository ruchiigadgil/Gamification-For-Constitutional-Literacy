import React, { useState } from "react"

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const menuItems = [
    {
      id: 'nlp',
      title: 'NLP',
      description: 'Natural Language Processing for Constitution',
      icon: '💬',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/nlp'
    },
    {
      id: 'games',
      title: 'Games',
      description: 'Interactive Constitutional Games',
      icon: '🎮',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/games'
    },
    {
      id: 'quiz',
      title: 'Learning Quiz',
      description: 'Test your Constitutional Knowledge',
      icon: '📋',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/articleSection'
    },
    {
      id: 'about',
      title: 'About Us',
      description: 'Learn more about InConQuest',
      icon: 'ℹ️',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      path: '/about'
    },
    {
      id: 'books',
      title: 'Books Ref',
      description: 'Constitutional Reference Books',
      icon: '📚',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      path: '/books'
    },
    {
      id: 'lawyers',
      title: 'Connect with People',
      description: 'Get Expert Legal Consultation',
      icon: '👔',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      path: '/connect-lawyers'
    }
  ]

  const handleNavigation = (path) => {
    // Replace with actual React Router navigation
    window.location.href = path
  }

  const dashboardStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '40px 20px'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '60px'
  }

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    textShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#64748b',
    fontWeight: '400'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '25px',
    padding: '20px 0',
    maxWidth: '1000px',
    margin: '0 auto'
  }

  const getCardStyle = (item, isHovered) => ({
    background: isHovered ? item.color : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '30px 25px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.08)' 
      : '0 6px 20px rgba(0, 0, 0, 0.08)',
    border: isHovered ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden'
  })

  const cardContentStyle = {
    position: 'relative',
    zIndex: 2
  }

  const iconStyle = (isHovered) => ({
    fontSize: '2.5rem',
    marginBottom: '16px',
    display: 'block',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
    filter: isHovered ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' : 'none'
  })

  const cardTitleStyle = (isHovered) => ({
    fontSize: '1.5rem',
    fontWeight: '700',
    color: isHovered ? 'white' : '#1e293b',
    marginBottom: '10px',
    transition: 'all 0.3s ease'
  })

  const cardDescriptionStyle = (isHovered) => ({
    fontSize: '0.9rem',
    color: isHovered ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
    fontWeight: '400',
    lineHeight: '1.5',
    transition: 'all 0.3s ease'
  })

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.6s ease',
    zIndex: 1
  }

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
  `

  return (
    <>
      <style>{keyframes}</style>
      <div style={dashboardStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>InConQuest</h1>
          </div>

          <div style={gridStyle}>
            {menuItems.map((item, index) => {
              const isHovered = hoveredCard === item.id
              
              return (
                <div
                  key={item.id}
                  style={{
                    ...getCardStyle(item, isHovered),
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleNavigation(item.path)}
                >
                  <div style={cardContentStyle}>
                    <span style={iconStyle(isHovered)}>{item.icon}</span>
                    <h3 style={cardTitleStyle(isHovered)}>{item.title}</h3>
                    <p style={cardDescriptionStyle(isHovered)}>{item.description}</p>
                  </div>
                  
                  {isHovered && (
                    <div style={{
                      ...shimmerStyle,
                      left: '100%'
                    }}></div>
                  )}

                  {/* Background decoration */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `conic-gradient(from 0deg, ${item.color})`,
                    opacity: isHovered ? 0.1 : 0,
                    transition: 'all 0.4s ease',
                    borderRadius: '50%',
                    zIndex: 0
                  }}></div>
                </div>
              )
            })}
          </div>

          {/* Stats section */}
          <div style={{
            marginTop: '80px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            margin: '80px auto 0'
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '40px'
            }}>
              Your Learning Journey
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '25px'
            }}>
              {[
                { label: 'Quizzes Completed', value: '42', color: '#667eea' },
                { label: 'Badges Earned', value: '12', color: '#f093fb' },
                { label: 'Days Streak', value: '8', color: '#43e97b' },
                { label: 'XP Points', value: '3500', color: '#4facfe' }
              ].map((stat, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '20px 15px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}25)`,
                  border: `2px solid ${stat.color}30`,
                  transition: 'all 0.3s ease',
                  animation: `float 3s ease-in-out infinite ${index * 0.5}s`
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: stat.color,
                    marginBottom: '8px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard