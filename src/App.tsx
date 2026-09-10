import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { OutfitMatchPage } from './tools/outfit/OutfitMatchPage';
import { RoomLayoutPage } from './tools/room/RoomLayoutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/outfit" element={<OutfitMatchPage />} />
      <Route path="/room" element={<RoomLayoutPage />} />
    </Routes>
  );
}

export default App;
