import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileSelector from './components/ProfileSelector';
import Portfolio from './pages/Portfolio';
import PortfolioInteractive from './pages/PortfolioInteractive';
import ProjectDetail from './pages/ProjectDetail';
import AboutPage from './pages/AboutPage';
import JobsPage from './pages/JobsPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfileSelector />} />
      <Route path="/portfolio/:id" element={<Portfolio />} />
      <Route path="/portfolio-interactive/:id" element={<PortfolioInteractive />} />
      <Route path="/portfolio-classic/:id" element={<Portfolio />} />
      <Route path="/about/:id" element={<AboutPage />} />
      <Route path="/portfolio/:profileId/about/:aboutId" element={<AboutPage />} />
      <Route path="/portfolio/:profileId/project/:projectId" element={<ProjectDetail />} />
      <Route path="/portfolio/:profileId/jobs/:jobId" element={<JobsPage />} />
    
    </Routes>
  );
}

export default App;