import React from 'react';
import './Login.css';

const dddOptions = [
  "11", "21", "31", "41", "51", "61", "71", "81", "91", "12", "13", "14", "15", "16", "17", "18", "19", "20", "22", "23", "24", "25", "26", "27", "28",
  "32", "33", "34", "35", "37", "38", "39", "40", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
  "61", "62", "63", "64", "65", "66", "67", "68", "69"
];

function PhoneInput({ value, onChange }) {
  return (
    <div>
      <select
        value={value.slice(0, 2)}
        onChange={(e) => onChange({ target: { value: e.target.value + value.slice(2) } })}
      >
        <option value="">DDD</option>
        {dddOptions.map((ddd) => (
          <option key={ddd} value={ddd}>{ddd}</option>
        ))}
      </select>
      <input
        type="text"
        maxLength="9"
        value={value.slice(2)}
        onChange={(e) => onChange({ target: { value: value.slice(0, 2) + e.target.value } })}
        placeholder="Telefone"
      />
    </div>
  );
}

export default PhoneInput;