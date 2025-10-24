import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Button from "./Design/Button"

const LandingPage = () => {
  const navigate = useNavigate()
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)

      if (position > window.innerHeight / 2) {
        navigate("/dashboard")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navigate])

  const landingPageStyle = {
    height: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #5b4b9d 0%, #7a6bb0 25%, #9b89c3 50%, #bca7d6 75%, #ddc5e9 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
      zIndex: 1
    }
  }

  const landingContentStyle = {
    textAlign: 'center',
    zIndex: 2,
    position: 'relative',
    padding: '0 20px',
    maxWidth: '800px'
  }

  const logoContainerStyle = {
    marginBottom: '150px',
    animation: 'fadeInUp 1.2s ease-out'
  }

  const logoStyle = {
    fontSize: '5.5rem',
    fontWeight: '800',
    letterSpacing: '3px',
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #ffffff 0%, #f8f4ff 50%, #e6d9f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 4px 20px rgba(91, 75, 157, 0.3)',
    animation: 'glow 3s ease-in-out infinite alternate',
    lineHeight: '1.1'
  }

  const taglineStyle = {
    fontSize: '1.6rem',
    opacity: '0.95',
    color: '#f0e6ff',
    fontWeight: '300',
    letterSpacing: '1px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 2s ease-out 0.5s both'
  }

  const scrollIndicatorStyle = {
    position: 'absolute',
    bottom: '80px',
    left: '0',
    right: '0',
    textAlign: 'center',
    animation: 'bounce 2s infinite',
    zIndex: 3
  }

  const startButtonStyle = {
    display: 'inline-block',
    marginBottom: '20px',
    padding: '15px 35px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '1px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: '0 8px 32px rgba(106, 76, 147, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  }

  const arrowDownStyle = {
    width: '20px',
    height: '20px',
    borderRight: '3px solid rgba(255, 255, 255, 0.9)',
    borderBottom: '3px solid rgba(255, 255, 255, 0.9)',
    transform: 'rotate(45deg)',
    margin: '15px auto',
    borderRadius: '2px'
  }

  // Floating particles background
  const particlesStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none'
  }

  const createParticles = () => {
    const particles = []
    for (let i = 0; i < 50; i++) {
      const particleStyle = {
        position: 'absolute',
        width: Math.random() * 4 + 2 + 'px',
        height: Math.random() * 4 + 2 + 'px',
        background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
        borderRadius: '50%',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `float ${Math.random() * 20 + 10}s linear infinite`,
        animationDelay: Math.random() * 20 + 's'
      }
      particles.push(<div key={i} style={particleStyle}></div>)
    }
    return particles
  }

  // Add CSS animations via style tag
  const keyframesStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes glow {
      from {
        text-shadow: 0 4px 20px rgba(106, 76, 147, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
      }
      to {
        text-shadow: 0 4px 30px rgba(106, 76, 147, 0.5), 0 0 60px rgba(255, 255, 255, 0.2);
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-20px) rotate(90deg);
      }
      50% {
        transform: translateY(0) rotate(180deg);
      }
      75% {
        transform: translateY(-10px) rotate(270deg);
      }
    }
  `

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={landingPageStyle}>
        <div style={particlesStyle}>
          {createParticles()}
        </div>
        
        <div style={landingContentStyle}>
          <div style={logoContainerStyle}>
            <h1 style={logoStyle}>InConQuest</h1>
            <p style={taglineStyle}>Gamified Indian Constitution Learning</p>
          </div>
          <div style={{height: '200px', position: 'relative'}}>
            .
          </div>
          <div style={scrollIndicatorStyle}>
            <Link 
              to="/dashboard" 
              style={startButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                e.target.style.transform = 'translateY(-3px) scale(1.05)'
                e.target.style.boxShadow = '0 12px 40px rgba(106, 76, 147, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.boxShadow = '0 8px 32px rgba(106, 76, 147, 0.2)'
              }}
            >
              <Button />
            </Link>
            
            <div style={arrowDownStyle}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage