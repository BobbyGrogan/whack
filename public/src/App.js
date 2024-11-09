import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [currentText, setCurrentText] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [tabCount, setTabCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);

  useEffect(() => {
    // Fetch questions from the API
    fetch('/api/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleSelectChange = (event) => {
    const selectedText = event.target.value;
    setSelectedText(selectedText);
    setCurrentText(selectedText.trim().split(/\s+/).map(word => word.toLowerCase()));
    setInputValue('');
    setCurrentIndex(0);
    setIncorrectCount(0);
    setTabCount(0);
    setIsCorrect(true);
  };

  const handleInputChange = (event) => {
    const typedWords = event.target.value.trim().toLowerCase().split(/\s+/);
    const lastTypedWord = typedWords[typedWords.length - 1] || "";
    const currentTextWord = currentText[currentIndex] || "";

    const isCorrect = typedWords.every((word, index) => word === currentText[index] || currentText[index].startsWith(word));
    setIsCorrect(isCorrect);

    if (isCorrect && lastTypedWord === currentTextWord) {
      setCurrentIndex(typedWords.length);
    } else if (!isCorrect && lastTypedWord !== currentTextWord) {
      setIncorrectCount(prevCount => prevCount + 1);
    }

    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const typedWords = inputValue.trim().toLowerCase().split(/\s+/);
      const lastTypedWord = typedWords[typedWords.length - 1] || "";
      const currentTextWord = currentText[currentIndex] || "";

      if (currentTextWord.startsWith(lastTypedWord)) {
        typedWords[typedWords.length - 1] = currentTextWord;
      } else if (currentIndex < currentText.length) {
        typedWords.push(currentTextWord);
      }

      setInputValue(typedWords.join(' ') + ' ');
      setCurrentIndex(currentIndex + 1);
      setTabCount(prevCount => prevCount + 1);
    }
  };

  return (
    <div className="App">
      <h1>Typing Speed Challenge</h1>
      <select onChange={handleSelectChange}>
        <option value="">Select a name</option>
        {questions.map((question) => (
          <option key={question.id} value={question.text}>
            {question.name}
          </option>
        ))}
      </select>
      <div style={{ marginTop: '10px' }}>{selectedText && questions.find(q => q.text === selectedText)?.question}</div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing here..."
        className={isCorrect ? 'correct' : 'incorrect'}
      />
      <div id="stats">
        <p>Incorrect Typing Count: <span>{incorrectCount}</span></p>
        <p>Tab Usage Count: <span>{tabCount}</span></p>
      </div>
    </div>
  );
}

export default App;
