// API service to fetch article data from the backend

const API_URL = "http://localhost:5000/generate"
const AUTH_API_URL = "http://localhost:3001/api/auth"

export const fetchArticleData = async (articleNumber) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Article ${articleNumber}`,
      }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching article data:", error)
    throw error
  }
}

export const markDailyWordCompleted = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }

    const response = await fetch(`${AUTH_API_URL}/complete-daily`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark daily as completed');
    }

    const data = await response.json();
    
    // Update user in localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      dailyWordCompleted: true,
      xp: data.user.xp
    }));
    
    return data;
  } catch (error) {
    console.error("Error marking daily as completed:", error);
    throw error;
  }
}

