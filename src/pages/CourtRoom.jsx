import React, { useState } from "react";

function CourtRoom() {
  const [selectedCase, setSelectedCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [answers, setAnswers] = useState({ who_needs_to_improve: "", reason: "", learning_point: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const cases = [
    { id: 'property', title: '🌻 Garden Sharing Story', desc: 'Two neighbors learning to share garden space peacefully' },
    { id: 'investigation', title: '📚 Library Book Conflict', desc: 'Students learning about sharing and responsibility' }
  ];

  const generateCase = async () => {
    if (!selectedCase) {
      setError("Please select a case first!");
      return;
    }

    setError("");
    setResult(null);
    setCaseData(null);
    setAnswers({ who_needs_to_improve: "", reason: "", learning_point: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5005/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType: selectedCase })
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to generate case");
      } else {
        setCaseData(json);
      }
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const submitAnswers = () => {
    if (!caseData) return;

    const { who_needs_to_improve, reason, learning_point } = answers;
    if (!who_needs_to_improve || !reason || !learning_point) {
      setError("Please answer all questions!");
      console.log("Missing answers:", { who_needs_to_improve, reason, learning_point });
      return;
    }

    setError(""); // Clear any previous errors
    const correct = caseData.correctAnswers || {};
    const score =
      (answers.who_needs_to_improve === correct.who_needs_to_improve ? 1 : 0) +
      (answers.reason === correct.reason ? 1 : 0) +
      (answers.learning_point === correct.learning_point ? 1 : 0);

    setResult({
      score,
      total: 3,
      success: score === 3,
      message: score === 3 ? "🎉 Perfect! You understood the conflict resolution completely!" : 
               score === 2 ? "👏 Good job! You got most of it right." :
               score === 1 ? "💪 Nice try! Review the situation again." :
               "📚 Keep learning! Read the peaceful resolution below.",
      resolution: caseData.positive_resolution || ""
    });
  };

  const resetCase = () => {
    setCaseData(null);
    setAnswers({ who_needs_to_improve: "", reason: "", learning_point: "" });
    setResult(null);
    setError("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤝 Junior Mediator - Conflict Resolution Learning</h1>
        <p style={styles.subtitle}>Learn law by solving real-life cases!</p>
      </div>

      {!caseData ? (
        <div style={styles.caseSelection}>
          <h2 style={styles.sectionTitle}>Select a Case to Solve</h2>
          
          <div style={styles.caseGrid}>
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                style={{
                  ...styles.caseCard,
                  ...(selectedCase === c.id ? styles.caseCardSelected : {})
                }}
              >
                <h3 style={styles.caseTitle}>{c.title}</h3>
                <p style={styles.caseDesc}>{c.desc}</p>
                {selectedCase === c.id && (
                  <div style={styles.selectedBadge}>✓ Selected</div>
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
              ...(loading || !selectedCase ? styles.buttonDisabled : {})
            }}
          >
            {loading ? "⏳ Generating Case..." : "🎯 Generate Case"}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </div>
      ) : (
        <div style={styles.caseView}>
          <div style={styles.caseHeader}>
            <h2 style={styles.caseViewTitle}>{caseData.caseTitle || "Case Details"}</h2>
            <button onClick={resetCase} style={styles.resetButton}>
              ← Back to Cases
            </button>
          </div>

          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>📋 Case Summary</h3>
            <p style={styles.summaryText}>{caseData.summary}</p>
          </div>

          <div style={styles.dialoguesSection}>
            <h3 style={styles.sectionTitle}>👥 Court Statements</h3>
            
            <div style={styles.dialoguesGrid}>
              <div style={styles.personColumn}>
                <h4 style={styles.personName}>
                  {caseData.personA_name || "Person A"}
                </h4>
                {caseData.personA_dialogues?.map((d, i) => (
                  <div key={i} style={styles.dialogueBoxA}>
                    <span style={styles.dialogueNumber}>#{i + 1}</span>
                    <p style={styles.dialogueText}>{d}</p>
                  </div>
                ))}
              </div>

              <div style={styles.personColumn}>
                <h4 style={styles.personName}>
                  {caseData.personB_name || "Person B"}
                </h4>
                {caseData.personB_dialogues?.map((d, i) => (
                  <div key={i} style={styles.dialogueBoxB}>
                    <span style={styles.dialogueNumber}>#{i + 1}</span>
                    <p style={styles.dialogueText}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.questionsSection}>
            <h3 style={styles.sectionTitle}>🧠 Help Resolve This Situation</h3>

            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>1. Who needs to improve their behavior?</label>
              <div style={styles.optionsContainer}>
                {caseData.mcq?.who_needs_to_improve?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="guilty"
                      checked={answers.guilty === opt}
                      onChange={() => selectAnswer("guilty", opt)}
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>2. What is the reason?</label>
              <div style={styles.optionsGrid}>
                {caseData.mcq?.reason?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="reason"
                      checked={answers.reason === opt}
                      onChange={() => selectAnswer("reason", opt)}
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>3. What Constitutional value does this teach?</label>
              <div style={styles.optionsGrid}>
                {caseData.mcq?.learning_point?.map((opt, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="learning_point"
                      checked={answers.learning_point === opt}
                      onChange={() => selectAnswer("learning_point", opt)}
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={submitAnswers}
              style={{...styles.button, ...styles.verdictButton}}
            >
              ✅ Submit My Resolution
            </button>

            {error && <div style={styles.error}>{error}</div>}
          </div>

          {result && (
            <div style={{
              ...styles.resultBox,
              ...(result.success ? styles.resultSuccess : styles.resultPartial)
            }}>
              <h3 style={styles.resultTitle}>
                {result.success ? "🎉 Perfect Understanding!" : "📊 Your Learning Result"}
              </h3>
              
              <p style={styles.resultMessage}>{result.message}</p>
              
              <p style={styles.resultScore}>
                Score: <strong>{result.score}/{result.total}</strong>
                {result.success && " - Excellent work, Mediator!"}
              </p>

              <div style={styles.explanationBox}>
                <h4 style={styles.explanationTitle}>🌿 Peaceful Resolution</h4>
                <p style={styles.explanationText}>{result.resolution}</p>
              </div>

              <div style={styles.correctAnswersBox}>
                <h4 style={styles.correctAnswersTitle}>✅ Correct Answers:</h4>
                <ul style={styles.correctAnswersList}>
                  <li><strong>Who needs to improve:</strong> {caseData.correctAnswers.who_needs_to_improve}</li>
                  <li><strong>Reason:</strong> {caseData.correctAnswers.reason}</li>
                  <li><strong>Learning Point:</strong> {caseData.correctAnswers.learning_point}</li>
                </ul>
              </div>

              <button onClick={resetCase} style={{...styles.button, ...styles.newCaseButton}}>
                🔄 Try Another Case
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
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0
  },
  caseSelection: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1e3c72',
    marginBottom: '20px',
    textAlign: 'center'
  },
  caseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  caseCard: {
    padding: '25px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    background: 'white'
  },
  caseCardSelected: {
    borderColor: '#2a5298',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 8px 20px rgba(42, 82, 152, 0.3)'
  },
  caseTitle: {
    fontSize: '1.2rem',
    color: '#1e3c72',
    marginBottom: '10px'
  },
  caseDesc: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  selectedBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#4caf50',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  button: {
    padding: '14px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  generateButton: {
    background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
    color: 'white',
    width: '100%',
    boxShadow: '0 4px 15px rgba(42, 82, 152, 0.4)'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  error: {
    marginTop: '15px',
    padding: '12px',
    background: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    textAlign: 'center'
  },
  caseView: {
    maxWidth: '1100px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  caseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  caseViewTitle: {
    fontSize: '1.8rem',
    color: '#1e3c72',
    margin: 0
  },
  resetButton: {
    padding: '10px 20px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#1e3c72'
  },
  summaryBox: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    border: '2px solid #ffb74d'
  },
  summaryTitle: {
    fontSize: '1.2rem',
    color: '#e65100',
    marginBottom: '10px'
  },
  summaryText: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.6',
    margin: 0
  },
  dialoguesSection: {
    marginBottom: '30px'
  },
  dialoguesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  personColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  personName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '5px',
    textAlign: 'center'
  },
  dialogueBoxA: {
    background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
    padding: '15px',
    borderRadius: '10px',
    borderLeft: '4px solid #3f51b5',
    position: 'relative'
  },
  dialogueBoxB: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    padding: '15px',
    borderRadius: '10px',
    borderLeft: '4px solid #e91e63',
    position: 'relative'
  },
  dialogueNumber: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '5px',
    display: 'block'
  },
  dialogueText: {
    fontSize: '0.95rem',
    color: '#333',
    margin: 0,
    lineHeight: '1.5'
  },
  questionsSection: {
    background: '#f5f5f5',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  question: {
    marginBottom: '25px'
  },
  questionLabel: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e3c72',
    marginBottom: '12px'
  },
  optionsGrid: {
    display: 'grid',
    gap: '10px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    background: 'white',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  optionText: {
    fontSize: '0.95rem',
    color: '#333'
  },
  verdictButton: {
    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
    color: 'white',
    width: '100%',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
  },
  resultBox: {
    padding: '25px',
    borderRadius: '12px',
    marginTop: '25px'
  },
  resultSuccess: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    border: '2px solid #4caf50'
  },
  resultPartial: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    border: '2px solid #ff9800'
  },
  resultTitle: {
    fontSize: '1.5rem',
    color: '#1e3c72',
    marginBottom: '15px'
  },
  resultScore: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '20px'
  },
  explanationBox: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  explanationTitle: {
    fontSize: '1.1rem',
    color: '#1e3c72',
    marginBottom: '10px'
  },
  explanationText: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
    margin: 0
  },
  correctAnswersBox: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  correctAnswersTitle: {
    fontSize: '1.1rem',
    color: '#1e3c72',
    marginBottom: '10px'
  },
  correctAnswersList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#333'
  },
  newCaseButton: {
    background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
    color: 'white',
    width: '100%',
    boxShadow: '0 4px 15px rgba(42, 82, 152, 0.4)'
  }
};

export default CourtRoom;
