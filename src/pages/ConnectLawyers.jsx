import "./ConnectLawyers.css"

const ConnectLawyers = () => {
  const lawyers = [
    {
      id: 1,
      name: "Adv. Arun Mehta",
      specialization: "Constitutional Law",
      experience: "15+ years",
      location: "New Delhi",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/150?img=61",
      availability: "Available for consultation",
    },
    {
      id: 2,
      name: "Adv. Priya Sharma",
      specialization: "Human Rights Law",
      experience: "12+ years",
      location: "Mumbai",
      rating: 4.7,
      avatar: "https://i.pravatar.cc/150?img=32",
      availability: "Available next week",
    },
    {
      id: 3,
      name: "Adv. Rajiv Khanna",
      specialization: "Public Interest Litigation",
      experience: "20+ years",
      location: "Bangalore",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/150?img=68",
      availability: "Limited availability",
    },
    {
      id: 4,
      name: "Adv. Meera Patel",
      specialization: "Fundamental Rights",
      experience: "8+ years",
      location: "Chennai",
      rating: 4.6,
      avatar: "https://i.pravatar.cc/150?img=47",
      availability: "Available for consultation",
    },
    {
      id: 5,
      name: "Adv. Vikram Singh",
      specialization: "Administrative Law",
      experience: "10+ years",
      location: "Kolkata",
      rating: 4.5,
      avatar: "https://i.pravatar.cc/150?img=59",
      availability: "Available for consultation",
    },
    {
      id: 6,
      name: "Adv. Sunita Reddy",
      specialization: "Constitutional Remedies",
      experience: "14+ years",
      location: "Hyderabad",
      rating: 4.7,
      avatar: "https://i.pravatar.cc/150?img=33",
      availability: "Available next week",
    },
  ]

  return (
    <div className="lawyers-page">
      <h1 className="page-title">Connect with Lawyers</h1>

      <div className="lawyers-intro">
        <h2>Expert Legal Guidance</h2>
        <p>
          Connect with experienced constitutional law experts for personalized guidance and consultation. Our network of
          lawyers specializes in various aspects of constitutional law and can help you understand your rights and legal
          options.
        </p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <input type="text" placeholder="Search by name, specialization, or location..." />
          <button className="search-button">Search</button>
        </div>
        <div className="filter-options">
          <select className="filter-select">
            <option value="">All Specializations</option>
            <option value="constitutional">Constitutional Law</option>
            <option value="human-rights">Human Rights Law</option>
            <option value="public-interest">Public Interest Litigation</option>
            <option value="fundamental">Fundamental Rights</option>
            <option value="administrative">Administrative Law</option>
          </select>
          <select className="filter-select">
            <option value="">All Locations</option>
            <option value="delhi">New Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="chennai">Chennai</option>
            <option value="kolkata">Kolkata</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
          <select className="filter-select">
            <option value="">Availability</option>
            <option value="available">Available Now</option>
            <option value="next-week">Available Next Week</option>
            <option value="limited">Limited Availability</option>
          </select>
        </div>
      </div>

      <div className="lawyers-grid">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="lawyer-card">
            <div className="lawyer-header">
              <div className="lawyer-avatar">
                <img src={lawyer.avatar || "/placeholder.svg"} alt={lawyer.name} />
              </div>
              <div className="lawyer-info">
                <h3>{lawyer.name}</h3>
                <span className="lawyer-specialization">{lawyer.specialization}</span>
                <div className="lawyer-rating">
                  <span className="rating-stars">★★★★★</span>
                  <span className="rating-value">{lawyer.rating}</span>
                </div>
              </div>
            </div>
            <div className="lawyer-details">
              <div className="detail-item">
                <span className="detail-label">Experience:</span>
                <span className="detail-value">{lawyer.experience}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{lawyer.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Availability:</span>
                <span className="detail-value availability">{lawyer.availability}</span>
              </div>
            </div>
            <div className="lawyer-actions">
              <button className="consult-button">Request Consultation</button>
              <button className="profile-button">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      <div className="consultation-info">
        <h2>How Consultations Work</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Lawyers</h3>
            <p>Explore our network of constitutional law experts and find the right match for your needs.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Request Consultation</h3>
            <p>Send a consultation request to your chosen lawyer with details about your query.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Schedule Meeting</h3>
            <p>Once your request is accepted, schedule a meeting at a convenient time.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Expert Advice</h3>
            <p>Connect via video call or in-person to receive personalized legal guidance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectLawyers
