"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./LandingPage"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import NLP from "./pages/NLP"
import Games from "./pages/Games"
import Learning from "./pages/Learning"
import Books from "./pages/Books"
import "./App.css"
import ArticleSelection from "./pages/ArticleSelection"
import Quiz from "./pages/Quiz"
import Results from "./pages/Results"
import GameComponent from "./SnakesLadders/components/GameComponent"
import boardImage from "./SnakesLadders/assets/board.png"
import MultiQuiz from "./MultiQuiz"
import Game from "./MazeGame/game"
import Pictionary from "./PictionaryGame/Pictionary"
import Team from "./pages/About/Team"
import Profile from "./pages/About/Profile"
import { ProfileContextProvider } from "./pages/About/ProfileContext";
import GameDaily from "./Daily/Game"
import CourtRoom from "./pages/CourtRoom"
import News from "./pages/news"

function AppContent() {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // const location = useLocation();
  // const shouldShowSidebar = () => location.pathname !== '/snakeladder';

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/*"
          element={
            <div className="">
              {/* {shouldShowSidebar() && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
              <div className={`content ${sidebarOpen && shouldShowSidebar() ? "content-shifted" : ""}`}> */}
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/nlp" element={<NLP />} />
                <Route path="/games" element={<Games />} />
                <Route path="/articleSection" element={<ArticleSelection />} />
                <Route path="/learning/:articleNumber" element={<Learning />} />
                <Route path="/quiz/:articleNumber" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/about" element={<Team />} />
                <Route path="/books" element={<Books/>} />
                <Route path="/snakeladder" element={<GameComponent boardImage={boardImage} />} />
                <Route path="/multi_quiz" element={<MultiQuiz />} />
                <Route path="/maze_game" element={<Game />} />
                <Route path="/pictionary" element={<Pictionary />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/daily" element={<GameDaily/>}/>
                <Route path="/court" element={<CourtRoom/>}/>
                <Route path="/news" element={<News/>}/>
              </Routes>
              {/* </div> */}
            </div>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    document.body.appendChild(script)

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,gu,mr,bn,te,ta",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      )
    }
  }, [])

  return (
    <div>
       
        <div id="google_translate_element"></div>
  
      <ProfileContextProvider> {/* Wrap Router with ProfileContextProvider */}
        <Router>
          <AppContent />
        </Router>
      </ProfileContextProvider>
    </div>
  )
}

export default App
