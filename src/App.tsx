import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MatchPage } from './tools/outfit/MatchPage';
import { WardrobePage } from './tools/outfit/WardrobePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<WardrobePage />} />
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
