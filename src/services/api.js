// API service to fetch article data from the backend

const API_URL = "http://localhost:5000/generate"

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

