import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading';

function Games() {
  const styles = {
    container: {
      marginTop: '100px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '40px',
      padding: '20px',
    },
    box: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '150px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      borderRadius: '10px',
      boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.2)',
    }
  }

  const [load, setLoad] = useState(true);

  useEffect(()=>{
    setTimeout(() => {
        setLoad(false)
    }, 3000);
  }, [])

  if (load) return <p><Loading/></p>;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.box, backgroundColor: '#ff99c8' }}><Link style={{textDecoration: "none", color: "black"}} to='/pictionary'>Pictionary</Link></div>
      <div style={{ ...styles.box, backgroundColor: '#fcf6bd' }}><Link to='/snakeladder'>Snakes and Ladders</Link></div>
      <div style={{ ...styles.box, backgroundColor: '#d0f4de' }}>Crossword</div>
      <div style={{ ...styles.box, backgroundColor: '#a9def9' }}>WordSearch</div>
    </div>
  )
}

export default Games
