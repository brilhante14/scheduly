import { Outlet } from 'react-router-dom';
import "./App.css";
import "./globals.css";

function App() {
  return (
    <div className='page-container'>
      <h1>
        Scheduly
      </h1>

      <Outlet />
    </div>
  );
}

export default App;
