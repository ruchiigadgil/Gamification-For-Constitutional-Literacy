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
    
    books: [
      {
        id: "The Boy Who Asked Why",
        name: "The Boy Who Asked Why",
        link: "https://fliphtml5.com/gryph/kqcc/basic",
        img: "https://api.getlitt.co/storage/books/original/bhimrao-ambedkar-the-boy-who-asked-why.jpeg",
      },
      {
        id: "NCERT",
        name: "The Constitution of India (Ebook)",
        link: "https://ncert.nic.in/textbook/pdf/gees110.pdf",
        img: "https://champaca.in/cdn/shop/files/61Uym8BxWxL._SY522_grande.jpg?v=1689235471",
      },
      {
        id: "Constitution: Why and How?",
        name: "Constitution: Why and How?",
        link: "https://samagra.kite.kerala.gov.in/files/samagra-resource/uploads/tbookscmq/Class_XI/PoliticalScience/Indianconstitutionatwork.pdf",
        img: "https://m.media-amazon.com/images/I/51HNKmecS0L._AC_UF350,350_QL50_.jpg",
      },
      {
        id: "We, Children of India",
        name: "We, Children of India by Leila Seth",
        link: "https://www.arvindguptatoys.com/arvindgupta/leila-seth.pdf",
        img: "https://1.bp.blogspot.com/_apRR_RXoSFE/S_4OPz7FuvI/AAAAAAAADh8/fRp_whlc7kk/s1600/We,+the+children+of+India.jpg",
      },
      {
        id: "Indian Constitution at Work",
        name: "Indian Constitution at Work",
        link: "https://afeias.com/wp-content/uploads/2019/04/class11_Indian-Constitution-at-Work.pdf",
        img: "https://ncert.nic.in/textbook/pdf/keps2cc.jpg",
      },
    ],
    The_Constitution_of_India:[
      {
        id: "English",
        name: "English",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2024/07/20240716890312078.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Hindi",
        name: "Hindi",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2025/03/202503201580504504.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Marathi",
        name: "Marathi",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/07/202507081043003900.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Kannada",
        name: "Kannada",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/05/2023051228.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Sanskrit",
        name: "Sanskrit",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2024/11/20241128615803263.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Punjabi",
        name: "Punjabi",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2024/06/202406101557910252.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
      {
        id: "Telugu",
        name: "Telugu",
        link: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2025/08/202508081113544342.pdf",
        img: "https://iasexamportal.com/sites/default/files/the-constitution-of-india-b.jpg",
      },
    ],
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
