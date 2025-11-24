import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";

const BookPage = () => {
  const [filter, setFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState({});

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
      articlesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (filter === "books" && booksRef.current) {
      booksRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (filter === "youtube" && youtubeRef.current) {
      youtubeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
    The_Constitution_of_India: [
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
    youtube: [
      {
        id: "Making of the Constitution",
        name: "Indian Constitution Explained",
        link: "https://www.youtube.com/watch?v=XrKEtEzqZ7g",
        img: "https://i.ytimg.com/vi/4tI4QXhzqNU/maxresdefault.jpg",
      },
      {
        id: "5 Types of Writs",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=3cG-0QeRF3o",
        img: "https://www.dakshindia.org/wp-content/uploads/2015/10/writ-e1455546866946-copy.webp",
      },
      {
        id: "All IMP Articles",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=Bnj1TNbEI4c",
        img: "https://eduauraapublic.s3.ap-south-1.amazonaws.com/webassets/images/blogs/how-many-articles-in-constitution-of-india.jpg",
      },
      {
        id: "26 Facts you didn't know",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=0t88M912C44",
        img: "https://www.lawpreptutorial.com/blog/wp-content/uploads/2025/10/Facts-about-Indian-Constitution.jpg",
      },
      {
        id: "Rajya vs Lok Sabha",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=MvwJ49hGr9s",
        img: "https://img.jagranjosh.com/images/2021/June/1562021/loksabha%20vs%20Rajyasabha.jpg",
      },
      {
        id: "Indian Parliamentary System",
        name: "Fundamental Rights Video",
        link: "https://www.youtube.com/watch?v=pb8b87e1re4",
        img: "https://chahalacademy.com/assets/study-material/parliament.webp",
      },
    ],
    articles: [
      {
        id: "Right To Equality",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/367586/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "Six Fundamental Freedoms",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/1218090/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "Right to Life & Personal Liberty",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/1199182/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "Right to Constitutional Remedy",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/981147/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "Freedom of Religion",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/631708/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
      },
      {
        id: "Prohibition of Discrimination",
        name: "Bharatiya Nyaya Sanhita 2023",
        link: "https://indiankanoon.org/doc/609295/",
        img: "https://www.lexisnexis.in/blogs/wp-content/uploads/2025/01/Blog-Banner-624x327.png",
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

  const handleScroll = (e, category) => {
    const element = e.target;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollProgress({ ...scrollProgress, [category]: scrollPercentage });
  };

  return (
    <div style={styles.container}>
      {/* Animated background particles */}
      <div style={styles.particle1}></div>
      <div style={styles.particle2}></div>
      <div style={styles.particle3}></div>

      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>📚</span>
          Books & References
          <span style={styles.titleIcon}>✨</span>
        </h1>
        <p style={styles.subtitle}>Explore our curated collection of educational resources</p>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search for books, articles, videos..."
            aria-label="Search Books and References"
            style={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={styles.filterContainer}>
            <Select
              options={data}
              placeholder="Filter"
              aria-label="Filter Books and References"
              onChange={(selected) => setFilter(selected?.value)}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  background: "rgba(255, 255, 255, 0.25)",
                  borderRadius: 20,
                  minWidth: 180,
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  padding: "8px 5px",
                  fontSize: "16px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "16px",
                  fontWeight: "600",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#ffffff",
                  fontWeight: "600",
                }),
                menu: (base) => ({
                  ...base,
                  background: "rgba(255, 255, 255, 0.98)",
                  borderRadius: 15,
                  backdropFilter: "blur(20px)",
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                }),
                option: (base, state) => ({
                  ...base,
                  background: state.isFocused
                    ? "linear-gradient(135deg, #a855f7, #c084fc)"
                    : "transparent",
                  color: state.isFocused ? "#ffffff" : "#333",
                  cursor: "pointer",
                  padding: "12px 20px",
                  fontWeight: state.isFocused ? "600" : "500",
                  transition: "all 0.2s ease",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {Object.keys(resources).map((category) => {
        const filtered = filteredResources(category);
        if (filtered.length === 0) return null;

        return (
          <div
            key={category}
            ref={
              category === "articles"
                ? articlesRef
                : category === "books"
                ? booksRef
                : category === "youtube"
                ? youtubeRef
                : null
            }
            style={styles.section}
          >
            <div style={styles.sectionHeader}>
              <h2 style={styles.headline}>
                <span style={styles.categoryIcon}>
                  {category === "books" ? "📖" : category === "youtube" ? "🎥" : "📄"}
                </span>
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ")}
                <span style={styles.badge}>{filtered.length}</span>
              </h2>
            </div>

            <div
              style={styles.scrollContainer}
              onScroll={(e) => handleScroll(e, category)}
            >
              <div style={styles.box}>
                {filtered.map((resource, index) => (
                  <a
                    key={resource.id}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.card,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div style={styles.imageContainer}>
                      <img
                        src={resource.img}
                        alt={resource.name}
                        style={category === "books" ? styles.imageBook : styles.image}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                      />
                      <div style={styles.overlay}>
                        <span style={styles.viewText}>View Resource →</span>
                      </div>
                    </div>
                    <div style={styles.cardContent}>
                      <p style={styles.resourceTitle}>{resource.id}</p>
                      <span style={styles.readMore}>Learn more</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Scroll indicator */}
            <div style={styles.scrollIndicator}>
              <div
                style={{
                  ...styles.scrollProgress,
                  width: `${scrollProgress[category] || 0}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  particle1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "-100px",
    left: "-100px",
    animation: "float 20s ease-in-out infinite",
    pointerEvents: "none",
  },
  particle2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "30%",
    right: "-50px",
    animation: "float 15s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  particle3: {
    position: "absolute",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "10%",
    left: "20%",
    animation: "float 18s ease-in-out infinite",
    pointerEvents: "none",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "52px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #ffffff 0%, #f0e7ff 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
    letterSpacing: "-1px",
    textShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
  },
  titleIcon: {
    fontSize: "48px",
    filter: "drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3))",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "18px",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "60px",
    position: "relative",
    zIndex: 1,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "12px 25px",
    borderRadius: "50px",
    width: "90%",
    maxWidth: "900px",
    gap: "15px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(20px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
  },
  searchIcon: {
    fontSize: "24px",
    filter: "grayscale(1) brightness(2)",
  },
  input: {
    flex: 1,
    fontSize: "17px",
    padding: "12px 15px",
    borderRadius: "30px",
    border: "none",
    outline: "none",
    background: "rgba(255, 255, 255, 0.25)",
    color: "#ffffff",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    fontWeight: "500",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
  },
  section: {
    marginBottom: "60px",
    position: "relative",
    zIndex: 1,
  },
  sectionHeader: {
    marginBottom: "25px",
    paddingLeft: "10px",
  },
  headline: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    letterSpacing: "-0.5px",
  },
  categoryIcon: {
    fontSize: "36px",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
  },
  badge: {
    background: "rgba(255, 255, 255, 0.25)",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "700",
    marginLeft: "8px",
    backdropFilter: "blur(10px)",
  },
  scrollContainer: {
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    borderRadius: "20px",
  },
  box: {
    display: "flex",
    gap: "30px",
    padding: "25px 15px",
    minHeight: "420px",
    alignItems: "stretch",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minWidth: "280px",
    maxWidth: "280px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    textDecoration: "none",
    overflow: "hidden",
    animation: "slideIn 0.6s ease-out forwards",
    opacity: 0,
    transform: "translateY(20px)",
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px 20px 0 0",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  imageBook: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(192, 132, 252, 0.9))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  viewText: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  resourceTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1a202c",
    margin: 0,
    lineHeight: "1.4",
  },
  readMore: {
    fontSize: "14px",
    color: "#a855f7",
    fontWeight: "600",
    marginTop: "auto",
  },
  scrollIndicator: {
    height: "4px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "2px",
    marginTop: "15px",
    overflow: "hidden",
  },
  scrollProgress: {
    height: "100%",
    background: "linear-gradient(90deg, #a855f7, #c084fc)",
    transition: "width 0.1s ease",
    borderRadius: "2px",
  },
};

// Add CSS animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-30px) rotate(5deg);
    }
  }

  div[style*="scrollContainer"]::-webkit-scrollbar {
    display: none;
  }

  a[style*="card"]:hover {
    transform: translateY(-12px) scale(1.02) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
  }

  a[style*="card"]:hover img {
    transform: scale(1.1) !important;
  }

  a[style*="card"]:hover div[style*="overlay"] {
    opacity: 1 !important;
  }

  input[style*="input"]:focus {
    background: rgba(255, 255, 255, 0.35) !important;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2) !important;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;
document.head.appendChild(styleSheet);

export default BookPage;