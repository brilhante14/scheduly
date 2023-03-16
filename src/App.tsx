import React from 'react';
import "./App.css";
import "./globals.css";
import { Schedule } from './pages/Schedule';

function App() {
  return (
    <div className='page-container'>
      <h1>
        Scheduly
      </h1>

      <Schedule />
    </div>
  );
}

export default App;
