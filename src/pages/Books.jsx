import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";

const BookPage = () => {
  const [filter, setFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const articlesRef = useRef(null);
  const booksRef = useRef(null);
  const youtubeRef = useRef(null);

  const data = [
    { label: "Articles", value: "articles" },
    { label: "Books", value: "books" },
    { label: "YouTube Links", value: "youtube" },
  ];

  useEffect(() => {
    if (filter === "articles" && articlesRef.current) {
      articlesRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (filter === "books" && booksRef.current) {
      booksRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (filter === "youtube" && youtubeRef.current) {
      youtubeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filter]);

  const resources = {
    articles: [
      {
        id: "article_1",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "article_2",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "article_3",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "article_4",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "article_5",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "article_6",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://www.lexisnexis.in/blogs/bharatiya-nyaya-sanhita-2023/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
    ],
    books: [
      {
        id: "book_1",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "book_2",
        name: "Indian Constitution PDF",
        link: "https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf",
        img: "https://archive.org/services/img/ConstitutionOfINDIA_201906/full/pct:200/0/default.jpg",
      },
      {
        id: "book_3",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "book_4",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "book_5",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "book_6",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "book_7",
        name: "The Constitution of India (Ebook)",
        link: "https://iasexamportal.com/ebook/the-constitution-of-india",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
    ],
    youtube: [
      {
        id: "youtube_1",
        name: "Indian Constitution Explained",
        link: "https://youtu.be/4tI4QXhzqNU?si=xoPoZ2PKffe1pisz",
        img: "https://i.ytimg.com/vi/4tI4QXhzqNU/maxresdefault.jpg",
      },
      {
        id: "youtube_2",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=atSSN6ZLzXQ",
        img: "https://i.ytimg.com/vi/fZFyTjEsUKI/hq720.jpg",
      },
      {
        id: "youtube_3",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=atSSN6ZLzXQ",
        img: "https://i.ytimg.com/vi/fZFyTjEsUKI/hq720.jpg",
      },
      {
        id: "youtube_4",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=atSSN6ZLzXQ",
        img: "https://i.ytimg.com/vi/fZFyTjEsUKI/hq720.jpg",
      },
      {
        id: "youtube_5",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=atSSN6ZLzXQ",
        img: "https://i.ytimg.com/vi/fZFyTjEsUKI/hq720.jpg",
      },
    ],
  };

  const filteredResources = (category) => {
    return resources[category].filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <h1 style={styles.text}>Books / References</h1>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search Books and References"
          style={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={styles.container2}>
          <Select
            options={data}
            placeholder="Filter By"
            aria-label="Filter Books and References"
            onChange={(selected) => setFilter(selected.value)}
            styles={{
              control: (base) => ({
                ...base,
                background: "white",
                borderRadius: 15,
                width: 200,
                border: "3px solid gray",
                padding: "15px",
                fontSize: "24px",
              }),
              placeholder: (base) => ({
                ...base,
                color: "gray",
                fontSize: "24px",
              }),
            }}
          />
        </div>
      </div>

      {Object.keys(resources).map((category) => (
        <div
          key={category}
          ref={
            category === "articles"
              ? articlesRef
              : category === "books"
              ? booksRef
              : youtubeRef
          }
          style={styles.container3}
        >
          <h2 style={styles.headline}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div style={styles.box}>
            {filteredResources(category).map((resource) => (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.resourceItem,
                  ...styles.specialResource,
                }}
              >
                <img
                  src={resource.img}
                  alt={resource.name}
                  style={
                    category === "books" ? styles.image_book : styles.image
                  }
                />
                <p style={styles.resourceText}>{resource.id}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookPage;

// const styles = {
//   container: { backgroundColor: 'black', padding: '30px', minHeight: '100vh', overflow: 'hidden' },
//   text: { color: '#a9def9', fontSize: '40px', fontWeight: 'bold', textAlign: 'center' },
//   row: { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '40px' },
//   input: { flex: 1, fontSize: '20px', padding: '2px' },
//   searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#d0f4de', padding: '25px', borderRadius: '60px', width: '60%', height: '20px', margin: '20px auto' },
//   container2: { display: 'flex', alignItems: 'center' },
//   headline: { color: '#a9def9', fontSize: 'px', fontWeight: '900', marginBottom: '20px' },
//   box: { display: 'flex', gap: '25px', backgroundColor: '#e4c1f9', height: '350px', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' },
//   image: { height: '200', width: '400px', borderRadius: '20px' },
//   image_book: { height: '300px', width: '250px', borderRadius: '20px' },
//   resourceText: { marginTop: 5, fontSize: 16, fontWeight: 'bold' },
//   specialResource: { color: 'black', textDecoration: 'none' }
// };

// const styles = {
//   container: {
//     backgroundColor: "black",
//     padding: "30px",
//     minHeight: "100vh",
//     overflow: "hidden",
//   },
//   text: {
//     color: "#a9def9",
//     fontSize: "40px",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   row: {
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//     marginTop: "40px",
//   },
//   input: {
//     flex: 1,
//     fontSize: "20px",
//     padding: "8px",
//     borderRadius: "10px",
//     border: "2px solid gray",
//   },
//   searchBar: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#d0f4de",
//     padding: "15px 25px",
//     borderRadius: "60px",
//     width: "60%",
//     margin: "20px auto",
//     gap: "15px",
//   },
//   container2: {
//     display: "flex",
//     alignItems: "center",
//   },
//   headline: {
//     color: "#a9def9",
//     fontSize: "28px", // fixed from 'px'
//     fontWeight: "900",
//     marginBottom: "20px",
//   },
//   box: {
//     display: "flex",
//     gap: "25px",
//     backgroundColor: "#e4c1f9",
//     height: "350px",
//     alignItems: "center",
//     overflowX: "auto",
//     whiteSpace: "nowrap",
//     padding: "10px",
//     borderRadius: "15px",
//   },
//   image: {
//     height: "200px", // fixed
//     width: "400px", // fixed
//     borderRadius: "20px",
//     objectFit: "cover",
//   },
//   image_book: {
//     height: "300px", // fixed
//     width: "250px", // fixed
//     borderRadius: "20px",
//     objectFit: "cover",
//   },
//   resourceText: {
//     marginTop: "5px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   specialResource: {
//     color: "black",
//     textDecoration: "none",
//   },
// };

const styles = {
  container: {
    backgroundColor: "#121212",
    padding: "30px",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  text: {
    color: "#a9def9",
    fontSize: "42px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "30px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  },
  input: {
    flex: 1,
    fontSize: "18px",
    padding: "12px 15px",
    borderRadius: "30px",
    border: "2px solid #a9def9",
    outline: "none",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: "10px 20px",
    borderRadius: "40px",
    width: "65%",
    margin: "20px auto 50px auto",
    gap: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  container2: {
    display: "flex",
    alignItems: "center",
  },
  headline: {
    color: "#ff99c8",
    fontSize: "28px",
    fontWeight: "900",
    margin: "10px 0 20px 10px",
    borderLeft: "6px solid #a9def9",
    paddingLeft: "12px",
  },
  box: {
    display: "flex",
    gap: "25px",
    backgroundColor: "#222",
    height: "380px",
    alignItems: "center",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  },
  resourceItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "250px",
    maxWidth: "300px",
    borderRadius: "15px",
    backgroundColor: "#fff",
    padding: "15px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  resourceItemHover: {
    transform: "scale(1.05)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
  },
  image: {
    height: "180px",
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    marginBottom: "12px",
  },
  image_book: {
    height: "250px",
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    marginBottom: "12px",
  },
  resourceText: {
    marginTop: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  specialResource: {
    color: "black",
    textDecoration: "none",
  },
};
