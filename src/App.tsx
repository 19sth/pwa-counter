import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MuLayout from './components/mulayout';
import Main from './pages/main';
import CounterAdd from './pages/counteradd';
import Settings from './pages/settings';
import { useEffect } from 'react';
import { registerServiceWorker } from './utils/notifications';

function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pwa-counter/" element={<MuLayout />}>
          <Route index element={<Main />} />
          <Route path="counter-add" element={<CounterAdd />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
