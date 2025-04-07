// client/src/components/Questionnaire.js
import React, { useState, useEffect } from 'react';
import { getQuestionnaire, sendQuestionnaireAnswers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Questionnaire = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionnaire();
        if (res.questionnaire && res.questionnaire.length > 0) {
          setQuestions(res.questionnaire);
        } else {
          // Domande di fallback (potresti anche definire domande reali qui)
          const defaultQuestions = [
            { text: "Quanto ti senti motivato oggi?" },
            { text: "Quanto ritieni efficace il tuo approccio allo studio?" },
            { text: "Quanto ti senti in controllo del tuo tempo?" },
            { text: "Quanto è chiaro il materiale didattico?" },
            { text: "Quanto è stimolante il tuo ambiente di studio?" }
          ];
          setQuestions(defaultQuestions);
        }
      } catch (err) {
        console.error("Errore nel caricamento del questionario:", err);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (index, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0 || Object.keys(answers).length !== questions.length) {
      setMessage("Seleziona una risposta per tutte le domande.");
      return;
    }
    try {
      const payload = {
        userId: user.userId,
        answers,
        questionnaire: questions
      };
      const res = await sendQuestionnaireAnswers(payload);
      if (res.success) {
        setMessage("Questionario inviato con successo!");
        setSubmitted(true);
        // Redirigi alla pagina di sessioni, oppure a una pagina di conferma
        setTimeout(() => {
          navigate('/sessions');
        }, 2000);
      } else {
        setMessage("Errore nell'invio del questionario.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore nell'invio del questionario.");
    }
  };

  if (submitted) {
    return (
      <div className="questionnaire-container">
        <h2>Questionario</h2>
        <div className="info-message">{message}</div>
      </div>
    );
  }

  return (
    <div className="questionnaire-container">
      <h2>Questionario</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <label>{q.text}</label>
            <div className="button-group">
              {[0, 1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  type="button"
                  className={`circle-button ${answers[index] === val ? 'selected' : ''}`}
                  onClick={() => handleAnswer(index, val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="primary-button">Invia Questionario</button>
      </form>
      {message && <div className="info-message">{message}</div>}
    </div>
  );
};

export default Questionnaire;
