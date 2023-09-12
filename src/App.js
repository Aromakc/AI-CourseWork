import Missionaries from './Missionaries';
import EightPuzzle from './EightPuzzle';
import EightPuzzleDFS from './EightPuzzleDFS';
import Home from './Home';
// route
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/1" element={<Missionaries />} />
        <Route path="/2" element={<EightPuzzle />} />
        <Route path="/3" element={<EightPuzzleDFS />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
