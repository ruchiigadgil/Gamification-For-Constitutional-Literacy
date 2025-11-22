import React, { useState } from "react";
import courtBg from "./images/court.png";

function CourtRoom() {
  const [selectedCase, setSelectedCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [answers, setAnswers] = useState({
    guilty: "",
    reason: "",
    article: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const cases = [
    {
      id: "murder",
      title: "The Missing Necklace Mystery",
      desc: "Who stole Grandma's precious gold necklace?",
    },
    {
      id: "property",
      title: "The Two Brothers & Papa's Farm",
      desc: "A fight over family land after their father passed away",
    },
  ];

  const generateCase = async () => {
    if (!selectedCase) {
      setError("Please select a case first!");
      return;
    }

    setError("");
    setResult(null);
    setCaseData(null);
    setAnswers({ guilty: "", reason: "", article: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5005/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType: selectedCase }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load case");

      setCaseData(json);
    } catch (e) {
      setError("Connection error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitVerdict = () => {
    if (!answers.guilty || !answers.reason || !answers.article) {
      setError("Please answer all three questions, Your Honor!");
      return;
    }

    setError("");
    const correct = caseData.correctAnswers;
    const score =
      (answers.guilty === correct.guilty ? 1 : 0) +
      (answers.reason === correct.reason ? 1 : 0) +
      (answers.article === correct.article ? 1 : 0);

    setResult({
      score,
      total: 3,
      success: score === 3,
      message:
        score === 3
          ? "Perfect Verdict, Your Honor!"
          : score === 2
          ? "Very Close! Great Judgment!"
          : "Good Try! Justice takes practice.",
    });
  };

  const resetCase = () => {
    setCaseData(null);
    setResult(null);
    setAnswers({ guilty: "", reason: "", article: "" });
    setError("");
    setCurrentDialogueIndex(0);
  };

  const nextDialogue = () => {
    const totalDialogues = caseData?.personA_dialogues?.length || 0;
    if (currentDialogueIndex < totalDialogues - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    }
  };

  const prevDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex((prev) => prev - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Junior Judge Courtroom</h1>
        <p style={styles.subtitle}>
          Solve real-life inspired mysteries • Deliver justice • Learn Indian
          Constitution!
        </p>
      </div>

      {!caseData ? (
        <div style={styles.caseSelection}>
          <h2 style={styles.sectionTitle}>Choose Your Case</h2>

          <div style={styles.caseGrid}>
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                style={{
                  ...styles.caseCard,
                  ...(selectedCase === c.id ? styles.caseCardSelected : {}),
                }}
              >
                <h3 style={styles.caseTitle}>{c.title}</h3>
                <p style={styles.caseDesc}>{c.desc}</p>
                {selectedCase === c.id && (
                  <div style={styles.selectedBadge}>Selected</div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={generateCase}
            disabled={loading || !selectedCase}
            style={{
              ...styles.button,
              ...styles.generateButton,
              ...(loading || !selectedCase ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Loading Court Case..." : "Start Trial"}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </div>
      ) : (
        <div style={styles.caseView}>
          <div style={styles.caseHeader}>
            <h2 style={styles.caseViewTitle}>{caseData.caseTitle}</h2>
            <button onClick={resetCase} style={styles.resetButton}>
              Back to Cases
            </button>
          </div>

          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>Case Summary</h3>
            <p style={styles.summaryText}>{caseData.summary}</p>
          </div>

          <div style={styles.dialoguesSection}>
            <h3 style={styles.sectionTitle}>
              ⚖️ Court Proceedings - Witness #{currentDialogueIndex + 1}
            </h3>

            <div style={styles.dialogueContainer}>
              {/* Person A Dialogue */}
              <div style={styles.singleDialogueBox}>
                <div style={styles.speakerHeader}>
                  <div style={styles.speakerAvatar}>👤</div>
                  <h4 style={styles.speakerName}>{caseData.personA_name}</h4>
                </div>
                <div style={styles.dialogueBubbleA}>
                  <p style={styles.dialogueTextLarge}>
                    {caseData.personA_dialogues?.[currentDialogueIndex]}
                  </p>
                </div>
              </div>

              {/* VS Divider */}
              <div style={styles.vsDivider}>
                <span style={styles.vsText}>VS</span>
              </div>

              {/* Person B Dialogue */}
              <div style={styles.singleDialogueBox}>
                <div style={styles.speakerHeader}>
                  <div style={styles.speakerAvatar}>👤</div>
                  <h4 style={styles.speakerName}>{caseData.personB_name}</h4>
                </div>
                <div style={styles.dialogueBubbleB}>
                  <p style={styles.dialogueTextLarge}>
                    {caseData.personB_dialogues?.[currentDialogueIndex]}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={styles.dialogueNavigation}>
              <button
                onClick={prevDialogue}
                disabled={currentDialogueIndex === 0}
                style={{
                  ...styles.navButton,
                  ...(currentDialogueIndex === 0
                    ? styles.navButtonDisabled
                    : {}),
                }}
              >
                ← Previous
              </button>

              <div style={styles.dialogueCounter}>
                Statement {currentDialogueIndex + 1} of{" "}
                {caseData.personA_dialogues?.length}
              </div>

              <button
                onClick={nextDialogue}
                disabled={
                  currentDialogueIndex ===
                  caseData.personA_dialogues?.length - 1
                }
                style={{
                  ...styles.navButton,
                  ...(currentDialogueIndex ===
                  caseData.personA_dialogues?.length - 1
                    ? styles.navButtonDisabled
                    : {}),
                }}
              >
                Next →
              </button>
            </div>
          </div>

          <div style={styles.questionsSection}>
            <h3 style={styles.sectionTitle}>Deliver Your Verdict</h3>

            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>1. Who is guilty?</label>
              <div style={styles.optionsContainer}>
                {caseData.mcq?.guilty?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="guilty"
                      checked={answers.guilty === opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, guilty: opt }))
                      }
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                2. What was their mistake?
              </label>
              <div style={styles.optionsContainer}>
                {caseData.mcq?.reason?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="reason"
                      checked={answers.reason === opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, reason: opt }))
                      }
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                3. Which Constitutional Right was affected?
              </label>
              <div style={styles.optionsContainer}>
                {caseData.mcq?.article?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="article"
                      checked={answers.article === opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, article: opt }))
                      }
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={submitVerdict}
              style={{ ...styles.button, ...styles.verdictButton }}
            >
              Deliver Final Verdict
            </button>

            {error && <div style={styles.error}>{error}</div>}
          </div>

          {result && (
            <div
              style={{
                ...styles.resultBox,
                ...(result.success
                  ? styles.resultSuccess
                  : styles.resultPartial),
              }}
            >
              <h3 style={styles.resultTitle}>
                {result.success ? "Perfect Verdict!" : "Verdict Delivered"}
              </h3>

              <p style={styles.resultMessage}>{result.message}</p>
              <p style={styles.resultScore}>
                Score:{" "}
                <strong>
                  {result.score}/{result.total}
                </strong>
              </p>

              <div style={styles.explanationBox}>
                <h4 style={styles.explanationTitle}>
                  Truth Revealed by the Court
                </h4>
                <p style={styles.explanationText}>
                  {caseData.verdict_explanation}
                </p>
                <p
                  style={{
                    ...styles.explanationText,
                    marginTop: "15px",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Judge’s Wisdom:</strong> {caseData.judge_tip}
                </p>
              </div>

              <div style={styles.correctAnswersBox}>
                <h4 style={styles.correctAnswersTitle}>Correct Answers:</h4>
                <ul style={styles.correctAnswersList}>
                  <li>
                    <strong>Guilty:</strong> {caseData.correctAnswers.guilty}
                  </li>
                  <li>
                    <strong>Reason:</strong> {caseData.correctAnswers.reason}
                  </li>
                  <li>
                    <strong>Article:</strong> {caseData.correctAnswers.article}
                  </li>
                </ul>
              </div>

              <button
                onClick={resetCase}
                style={{ ...styles.button, ...styles.newCaseButton }}
              >
                Try Another Case
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${courtBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "white",
    position: "relative",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    paddingTop: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.3rem",
    opacity: 0.9,
  },
  caseSelection: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    borderRadius: "25px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    color: "#333",
    border: "2px solid rgba(255, 215, 0, 0.3)",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#1e3c72",
    textAlign: "center",
    marginBottom: "30px",
  },
  caseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  caseCard: {
    padding: "30px",
    border: "3px solid #e0e0e0",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    background: "white",
    position: "relative",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  caseCardSelected: {
    borderColor: "#2a5298",
    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    transform: "translateY(-10px)",
    boxShadow: "0 15px 30px rgba(42, 82, 152, 0.4)",
  },
  caseTitle: {
    fontSize: "1.4rem",
    color: "#1e3c72",
    marginBottom: "12px",
  },
  caseDesc: {
    color: "#555",
    lineHeight: "1.5",
  },
  selectedBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#4caf50",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  button: {
    padding: "16px 40px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  generateButton: {
    background: "linear-gradient(135deg, #2a5298, #1e3c72)",
    color: "white",
    width: "100%",
    boxShadow: "0 6px 20px rgba(42, 82, 152, 0.5)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    marginTop: "20px",
    padding: "15px",
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
  caseView: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "25px",
    padding: "40px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
    color: "#333",
    border: "3px solid rgba(255, 215, 0, 0.3)",
  },
  caseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  caseViewTitle: {
    fontSize: "2.2rem",
    color: "#1e3c72",
    margin: 0,
  },
  resetButton: {
    padding: "12px 25px",
    background: "#f0f0f0",
    border: "2px solid #ddd",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  summaryBox: {
    background: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "35px",
    border: "3px solid #ffb300",
  },
  summaryTitle: {
    color: "#e65100",
    fontSize: "1.4rem",
    marginBottom: "12px",
  },
  summaryText: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#444",
  },
  dialoguesSection: {
    marginBottom: "40px",
  },
  dialoguesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  personColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  personName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1e3c72",
    textAlign: "center",
    marginBottom: "10px",
  },
  dialogueBoxA: {
    background: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)",
    padding: "18px",
    borderRadius: "15px",
    borderLeft: "6px solid #3f51b5",
    position: "relative",
  },
  dialogueBoxB: {
    background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
    padding: "18px",
    borderRadius: "15px",
    borderLeft: "6px solid #e91e63",
    position: "relative",
  },
  dialogueNumber: {
    fontWeight: "bold",
    color: "#666",
    marginBottom: "8px",
    display: "block",
  },
  dialogueText: {
    margin: 0,
    lineHeight: "1.6",
    fontSize: "1.02rem",
  },
  questionsSection: {
    background: "#f8f9fa",
    padding: "35px",
    borderRadius: "15px",
    marginBottom: "30px",
  },
  questionGroup: {
    marginBottom: "30px",
  },
  questionLabel: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#1e3c72",
    marginBottom: "15px",
    display: "block",
  },
  optionsContainer: {
    display: "grid",
    gap: "12px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "14px 18px",
    background: "white",
    border: "2px solid #ddd",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  radio: {
    marginRight: "15px",
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  optionText: {
    fontSize: "1.05rem",
    color: "#333",
  },
  verdictButton: {
    background: "linear-gradient(135deg, #d32f2f, #b71c1c)",
    color: "white",
    width: "100%",
    padding: "18px",
    fontSize: "1.4rem",
    boxShadow: "0 8px 25px rgba(211, 47, 47, 0.4)",
  },
  resultBox: {
    padding: "35px",
    borderRadius: "15px",
    marginTop: "30px",
    textAlign: "center",
  },
  resultSuccess: {
    background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    border: "4px solid #4caf50",
  },
  resultPartial: {
    background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    border: "4px solid #ff9800",
  },
  resultTitle: {
    fontSize: "2rem",
    color: "#1e3c72",
    marginBottom: "15px",
  },
  resultMessage: {
    fontSize: "1.4rem",
    marginBottom: "10px",
  },
  resultScore: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "25px",
  },
  explanationBox: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    margin: "20px 0",
    textAlign: "left",
  },
  explanationTitle: {
    color: "#d32f2f",
    fontSize: "1.4rem",
    marginBottom: "12px",
  },
  explanationText: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#333",
  },
  correctAnswersBox: {
    background: "#f0f0f0",
    padding: "20px",
    borderRadius: "12px",
    margin: "20px 0",
  },
  correctAnswersTitle: {
    color: "#d32f2f",
    marginBottom: "10px",
  },
  correctAnswersList: {
    textAlign: "left",
    color: "#333",
  },
  newCaseButton: {
    background: "linear-gradient(135deg, #2a5298, #1e3c72)",
    color: "white",
    padding: "16px 40px",
    fontSize: "1.2rem",
    marginTop: "20px",
  },
  // New Dialogue Styles
  dialogueContainer: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: "30px",
    alignItems: "start",
    marginBottom: "30px",
  },
  singleDialogueBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  speakerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  speakerAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  speakerName: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#1e3c72",
    margin: 0,
  },
  dialogueBubbleA: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "25px",
    borderRadius: "20px 20px 20px 5px",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    position: "relative",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
  },
  dialogueBubbleB: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    padding: "25px",
    borderRadius: "20px 20px 5px 20px",
    boxShadow: "0 8px 25px rgba(245, 87, 108, 0.3)",
    position: "relative",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
  },
  dialogueTextLarge: {
    margin: 0,
    fontSize: "1.15rem",
    lineHeight: "1.8",
    color: "white",
    fontWeight: "500",
  },
  vsDivider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "60px",
  },
  vsText: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    padding: "10px 20px",
    border: "3px solid #ffd700",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    boxShadow: "0 8px 20px rgba(255, 215, 0, 0.4)",
  },
  dialogueNavigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "25px",
    padding: "20px",
    background: "rgba(30, 60, 114, 0.1)",
    borderRadius: "15px",
  },
  navButton: {
    padding: "12px 30px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #2a5298, #1e3c72)",
    color: "white",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(42, 82, 152, 0.3)",
  },
  navButtonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  dialogueCounter: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#1e3c72",
    background: "white",
    padding: "10px 25px",
    borderRadius: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};

export default CourtRoom;
