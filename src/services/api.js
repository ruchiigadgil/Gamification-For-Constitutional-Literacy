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

/**
 * Increment the current user's xp by delta on the server and update local snapshot.
 * Dispatches a global 'user:update' event so other components (Dashboard) can refresh.
 */
export const updateUserXP = async (delta) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found; skipping xp update');
    return null;
  }

  // Optimistic update: update local snapshot and notify UI immediately
  const prevUser = JSON.parse(localStorage.getItem('user') || '{}');
  const prevXp = typeof prevUser.xp === 'number' ? prevUser.xp : 0;
  const optimisticUser = { ...prevUser, xp: prevXp + delta };
  localStorage.setItem('user', JSON.stringify(optimisticUser));
  // notify UI that update started
  window.dispatchEvent(new CustomEvent('user:update:pending', { detail: { delta } }));
  // Also trigger a regular user:update so components refresh
  window.dispatchEvent(new Event('user:update'));

  try {
    const res = await fetch('/api/auth/update-score', {
      method: 'POST',
      headers: {
        'Authorization': token.startsWith('Bearer') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ delta })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Failed to update score: ' + res.status + ' ' + txt);
    }

    const data = await res.json();

    // Persist authoritative snapshot from server
    if (data?.user) {
      const updated = { ...prevUser, ...data.user };
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('user:update'));
    }

    // notify UI that update finished
    window.dispatchEvent(new CustomEvent('user:update:done', { detail: { delta, serverUser: data?.user } }));

    return data;
  } catch (err) {
    console.error('updateUserXP error', err);
    // revert optimistic update
    localStorage.setItem('user', JSON.stringify(prevUser));
    window.dispatchEvent(new Event('user:update'));
    window.dispatchEvent(new CustomEvent('user:update:done', { detail: { delta, error: true } }));
    throw err;
  }
}

