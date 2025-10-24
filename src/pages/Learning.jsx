import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchArticleData } from "../services/api"

const Learning = () => {
  const { articleNumber } = useParams()
  const navigate = useNavigate()
  const [articleData, setArticleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [buttonHovers, setButtonHovers] = useState({
    quiz: false,
    video: false,
    back: false
  })

  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true)
        const data = await fetchArticleData(articleNumber)
        setArticleData(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load article data. Please try again.")
        setLoading(false)
      }
    }

    getArticleData()
  }, [articleNumber])

  const handleStartQuiz = () => {
    navigate(`/quiz/${articleNumber}`)
  }

  const handleBackToSelection = () => {
    navigate("/")
  }

  const handleToggleVideo = () => {
    setShowVideo(!showVideo)
  }

  const styles = {
    learningContainer: {
      maxWidth: '700px',
      margin: '1.5rem auto',
      padding: '0 1rem',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
      minHeight: '100vh'
    },
    
    articleCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 15px 40px rgba(74, 50, 117, 0.12), 0 0 0 1px rgba(74, 50, 117, 0.05)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      border: '1px solid rgba(138, 100, 199, 0.08)'
    },
    
    title: {
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #4a3275 0%, #8a64c7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      marginBottom: '2rem',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      position: 'relative',
      paddingBottom: '1rem'
    },
    
    titleUnderline: {
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '3px',
      background: 'linear-gradient(90deg, #4a3275, #8a64c7)',
      borderRadius: '2px'
    },
    
    learningContent: {
      marginBottom: '2rem'
    },
    
    sectionTitle: {
      fontSize: '1.4rem',
      color: '#4a3275',
      marginBottom: '1.5rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem'
    },
    
    sectionIcon: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4a3275, #8a64c7)',
      boxShadow: '0 0 15px rgba(74, 50, 117, 0.4)'
    },
    
    pointsList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    
    pointItem: (index, isHovered) => ({
      background: isHovered 
        ? 'linear-gradient(135deg, rgba(138, 100, 199, 0.06) 0%, rgba(74, 50, 117, 0.03) 100%)'
        : 'rgba(255, 255, 255, 0.6)',
      border: isHovered
        ? '1px solid rgba(138, 100, 199, 0.25)'
        : '1px solid rgba(138, 100, 199, 0.08)',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '1rem',
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      transform: isHovered ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
      boxShadow: isHovered 
        ? '0 8px 20px rgba(74, 50, 117, 0.15)'
        : '0 2px 8px rgba(74, 50, 117, 0.05)',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      color: '#333'
    }),
    
    pointNumber: (isHovered) => ({
      position: 'absolute',
      top: '0.8rem',
      right: '1rem',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: isHovered 
        ? 'linear-gradient(135deg, #4a3275, #8a64c7)'
        : 'rgba(138, 100, 199, 0.15)',
      color: isHovered ? 'white' : '#4a3275',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }),
    
    pointText: {
      paddingRight: '2.5rem'
    },
    
    videoContainer: {
      margin: '2rem 0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(74, 50, 117, 0.12)',
      border: '2px solid rgba(138, 100, 199, 0.08)',
      position: 'relative',
      paddingBottom: '56.25%',
      height: '0',
      background: 'linear-gradient(135deg, #f8f7ff, #ffffff)'
    },
    
    videoIframe: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      border: 'none'
    },
    
    learningActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
      gap: '0.8rem'
    },
    
    button: (type, isHovered) => {
      const baseStyle = {
        border: 'none',
        borderRadius: '25px',
        padding: '0.8rem 1.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
        overflow: 'hidden',
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        outline: 'none',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        letterSpacing: '0.01em'
      }
      
      if (type === 'quiz') {
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #4a3275 0%, #8a64c7 100%)',
          color: 'white',
          boxShadow: isHovered 
            ? '0 12px 25px rgba(74, 50, 117, 0.3)'
            : '0 6px 15px rgba(74, 50, 117, 0.2)'
        }
      } else if (type === 'video') {
        return {
          ...baseStyle,
          background: showVideo 
            ? 'linear-gradient(135deg, #e94057 0%, #f27121 100%)'
            : 'linear-gradient(135deg, #8a64c7 0%, #6a4d99 100%)',
          color: 'white',
          boxShadow: isHovered 
            ? showVideo 
              ? '0 12px 25px rgba(233, 64, 87, 0.3)'
              : '0 12px 25px rgba(138, 100, 199, 0.3)'
            : showVideo
              ? '0 6px 15px rgba(233, 64, 87, 0.2)'
              : '0 6px 15px rgba(138, 100, 199, 0.2)'
        }
      } else {
        return {
          ...baseStyle,
          background: isHovered 
            ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            : 'rgba(248, 249, 250, 0.8)',
          color: '#4a3275',
          border: '1px solid rgba(138, 100, 199, 0.15)',
          boxShadow: isHovered 
            ? '0 8px 20px rgba(74, 50, 117, 0.12)'
            : '0 4px 10px rgba(74, 50, 117, 0.06)'
        }
      }
    },
    
    buttonShine: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
      pointerEvents: 'none'
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      margin: '2rem auto',
      maxWidth: '400px',
      boxShadow: '0 15px 40px rgba(74, 50, 117, 0.1)'
    },
    
    loadingSpinner: {
      width: '40px',
      height: '40px',
      marginBottom: '1.5rem',
      position: 'relative'
    },
    
    spinnerRing: (delay) => ({
      position: 'absolute',
      width: '100%',
      height: '100%',
      border: '2px solid transparent',
      borderTop: '2px solid #8a64c7',
      borderRadius: '50%',
      animation: `spin 1.2s linear infinite ${delay}s`
    }),
    
    loadingText: {
      color: '#4a3275',
      fontSize: '1rem',
      fontWeight: '500'
    },
    
    errorContainer: {
      textAlign: 'center',
      padding: '2.5rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      margin: '2rem auto',
      maxWidth: '450px',
      boxShadow: '0 15px 40px rgba(233, 64, 87, 0.12)',
      border: '1px solid rgba(233, 64, 87, 0.1)'
    },
    
    errorTitle: {
      color: '#e94057',
      marginBottom: '1rem',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    
    errorText: {
      color: '#666',
      marginBottom: '1.5rem',
      lineHeight: '1.5',
      fontSize: '0.95rem'
    },
    
    floatingOrbs: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '-1'
    },
    
    orb: (index) => ({
      position: 'absolute',
      borderRadius: '50%',
      background: `linear-gradient(135deg, rgba(138, 100, 199, ${0.05 + index * 0.02}), rgba(74, 50, 117, ${0.03 + index * 0.01}))`,
      animation: `float ${4 + index}s ease-in-out infinite ${index * 0.8}s`,
      left: `${15 + index * 20}%`,
      top: `${5 + index * 25}%`,
      width: `${30 + index * 15}px`,
      height: `${30 + index * 15}px`
    })
  }

  if (loading) {
    return (
      <div style={styles.learningContainer}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(120deg); }
            66% { transform: translateY(8px) rotate(240deg); }
          }
        `}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>
            <div style={styles.spinnerRing(0)}></div>
            <div style={styles.spinnerRing(0.2)}></div>
            <div style={styles.spinnerRing(0.4)}></div>
          </div>
          <p style={styles.loadingText}>Loading article information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.learningContainer}>
        <div style={styles.errorContainer}>
          <h3 style={styles.errorTitle}>Error</h3>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.button('back', false)}
            onClick={handleBackToSelection}
          >
            Back to Article Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.learningContainer}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(120deg); }
          66% { transform: translateY(8px) rotate(240deg); }
        }
      `}</style>
      
      <div style={styles.articleCard}>
        {/* Floating orbs background */}
        <div style={styles.floatingOrbs}>
          {[0, 1, 2].map(index => (
            <div key={index} style={styles.orb(index)}></div>
          ))}
        </div>
        
        <h2 style={styles.title}>
          {articleData?.article}
          <div style={styles.titleUnderline}></div>
        </h2>
        
        <div style={styles.learningContent}>
          <h3 style={styles.sectionTitle}>
            <div style={styles.sectionIcon}></div>
            Key Points to Learn
          </h3>
          
          <ul style={styles.pointsList}>
            {articleData?.learning.map((point, index) => (
              <li 
                key={index}
                style={styles.pointItem(index, hoveredPoint === index)}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div style={styles.pointNumber(hoveredPoint === index)}>
                  {index + 1}
                </div>
                <div style={styles.pointText}>{point}</div>
              </li>
            ))}
          </ul>
        </div>
        
        {showVideo && (
          <div style={styles.videoContainer}>
            <iframe
              style={styles.videoIframe}
              src={`https://www.youtube.com/embed?list=PLLT_AY611kAgDMvWHDf8bLo4GtH-uzV_e&index=${articleNumber}`}
              title={`Article ${articleNumber} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        <div style={styles.learningActions}>
          <button 
            style={styles.button('quiz', buttonHovers.quiz)}
            onClick={handleStartQuiz}
            onMouseEnter={() => setButtonHovers(prev => ({...prev, quiz: true}))}
            onMouseLeave={() => setButtonHovers(prev => ({...prev, quiz: false}))}
          >
            Start Quiz
            <div style={{...styles.buttonShine, left: buttonHovers.quiz ? '100%' : '-100%'}}></div>
          </button>
          
          <button 
            style={styles.button('video', buttonHovers.video)}
            onClick={handleToggleVideo}
            onMouseEnter={() => setButtonHovers(prev => ({...prev, video: true}))}
            onMouseLeave={() => setButtonHovers(prev => ({...prev, video: false}))}
          >
            {showVideo ? "Hide Video" : "Show Video"}
            <div style={{...styles.buttonShine, left: buttonHovers.video ? '100%' : '-100%'}}></div>
          </button>
          
          <button 
            style={styles.button('back', buttonHovers.back)}
            onClick={handleBackToSelection}
            onMouseEnter={() => setButtonHovers(prev => ({...prev, back: true}))}
            onMouseLeave={() => setButtonHovers(prev => ({...prev, back: false}))}
          >
            Back to Selection
            <div style={{...styles.buttonShine, left: buttonHovers.back ? '100%' : '-100%'}}></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Learning