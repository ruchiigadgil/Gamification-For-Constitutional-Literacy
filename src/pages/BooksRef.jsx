import "./BooksRef.css"

const BooksRef = () => {
  const books = [
    {
      id: 1,
      title: "Indian Constitution at Work",
      author: "NCERT",
      description: "A comprehensive textbook that explains the working of the Indian Constitution in simple language.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Textbook",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Introduction to the Constitution of India",
      author: "Dr. Durga Das Basu",
      description: "A classic work on the Indian Constitution, covering its historical underpinnings and evolution.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Academic",
      rating: 4.8,
    },
    {
      id: 3,
      title: "The Indian Constitution: Cornerstone of a Nation",
      author: "Granville Austin",
      description: "An authoritative study of the Indian Constitution, focusing on its creation and early years.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Historical",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Constitutional Law of India",
      author: "H.M. Seervai",
      description: "A detailed analysis of constitutional law in India, with extensive case references.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Legal Reference",
      rating: 4.6,
    },
    {
      id: 5,
      title: "Our Constitution",
      author: "Subhash C. Kashyap",
      description: "An accessible introduction to the Indian Constitution for general readers.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "General",
      rating: 4.3,
    },
    {
      id: 6,
      title: "The Constitution of India: A Contextual Analysis",
      author: "Arun K. Thiruvengadam",
      description: "A modern analysis of the Indian Constitution in its social and political context.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Academic",
      rating: 4.4,
    },
    {
      id: 7,
      title: "Indian Constitutional Law",
      author: "M.P. Jain",
      description: "A comprehensive textbook on Indian constitutional law, widely used in law schools.",
      cover: "/placeholder.svg?height=200&width=150",
      category: "Textbook",
      rating: 4.5,
    },
    {
      id: 8,
      title: "Working a Democratic Constitution",
      author: "Granville Austin",
      description: 'A sequel to "Cornerstone of a Nation," examining the Constitution\'s evolution after 1950.',
      cover: "/placeholder.svg?height=200&width=150",
      category: "Historical",
      rating: 4.7,
    },
  ]

  const categories = ["All", "Textbook", "Academic", "Historical", "Legal Reference", "General"]

  return (
    <div className="books-page">
      <h1 className="page-title">Books & References</h1>

      <div className="books-intro">
        <h2>Essential Reading on the Indian Constitution</h2>
        <p>
          Explore our curated collection of books and references on the Indian Constitution. From introductory texts to
          advanced legal analyses, these resources will deepen your understanding of constitutional principles and their
          application.
        </p>
      </div>

      <div className="books-filter">
        <div className="category-filter">
          <span>Filter by Category:</span>
          <div className="category-buttons">
            {categories.map((category) => (
              <button key={category} className={`category-button ${category === "All" ? "active" : ""}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="search-filter">
          <input type="text" placeholder="Search books..." />
          <button className="search-button">Search</button>
        </div>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-cover">
              <img src={book.cover || "/placeholder.svg"} alt={book.title} />
              <span className="book-category">{book.category}</span>
            </div>
            <div className="book-details">
              <h3>{book.title}</h3>
              <span className="book-author">by {book.author}</span>
              <div className="book-rating">
                <span className="rating-value">{book.rating}</span>
                <span className="rating-stars">★★★★★</span>
              </div>
              <p className="book-description">{book.description}</p>
              <div className="book-actions">
                <button className="preview-button">Preview</button>
                <button className="bookmark-button">Bookmark</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="books-resources">
        <h2>Additional Resources</h2>
        <ul className="resources-list">
          <li>
            <span className="resource-name">Constitution of India (Full Text)</span>
            <a href="#" className="resource-link">
              Download PDF
            </a>
          </li>
          <li>
            <span className="resource-name">Supreme Court Judgments Database</span>
            <a href="#" className="resource-link">
              Access Online
            </a>
          </li>
          <li>
            <span className="resource-name">Constitutional Amendments Tracker</span>
            <a href="#" className="resource-link">
              View Timeline
            </a>
          </li>
          <li>
            <span className="resource-name">Constituent Assembly Debates</span>
            <a href="#" className="resource-link">
              Browse Archives
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BooksRef
