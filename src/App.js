import Home from './Home';
import EightPuzzle from './EightPuzzle';
// route
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path ="/" element={<EightPuzzle />} />
        <Route path="/1" element={<Home />} />
        <Route path="/2" element={<EightPuzzle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
