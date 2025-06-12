// src/components/SearchForm.js
import React, { useState } from 'react';
import '../styles/SearchForm.css';

function SearchForm({ onSearch, inputLabels, buttonText }) {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página
    onSearch(input1, input2); // Chama a função onSearch passada via props com os valores
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="input1">{inputLabels.input1}:</label>
        <input
          type="text"
          id="input1"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder={`Digite ${inputLabels.input1.toLowerCase()}`}
        />
      </div>
      <div className="form-group">
        <label htmlFor="input2">{inputLabels.input2}:</label>
        <input
          type="text"
          id="input2"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder={`Digite ${inputLabels.input2.toLowerCase()}`}
        />
      </div>
      <button type="submit" className="search-button">
        {buttonText}
      </button>
    </form>
  );
}

export default SearchForm;