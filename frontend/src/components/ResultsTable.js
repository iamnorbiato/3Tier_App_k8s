// src/components/ResultsTable.js
import React from 'react';
import '../styles/ResultsTable.css';

function ResultsTable({ data, columns }) {
  if (!data || data.length === 0) {
    return <p>Nenhum resultado para exibir.</p>;
  }

  return (
    <div className="table-container">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;