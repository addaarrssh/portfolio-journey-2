import { useState } from "react";
import Navbar from "./components/Navbar";
import StatusTicker from "./components/StatusTicker";
import Hero from "./components/Hero";
import Notebook from "./components/Notebook";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import ConspiracyBoard from "./components/ConspiracyBoard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CommandPalette from "./components/CommandPalette";
import DebugMode from "./components/DebugMode";
import CursorTrail from "./components/CursorTrail";
import LoadingScreen from "./components/LoadingScreen";
import Marginalia from "./components/Marginalia";
import TrainProgress from "./components/TrainProgress";
import TimeGreeter from "./components/TimeGreeter";
import SecretsOverlay from "./components/SecretsOverlay";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="visible">
      <StatusTicker />
      <Navbar />
      <div className="relative z-0">
        <main>
          <Hero />
          <Notebook />
          <Skills />
          <Projects />
          <Timeline />
          <ConspiracyBoard />
          <Contact />
        </main>
        <Footer />
      </div>
      <BackToTop />
      <CommandPalette />
      <DebugMode />
      <CursorTrail />
      <Marginalia />
      <TrainProgress />
      <TimeGreeter />
      <SecretsOverlay />
      {loading && (
        <LoadingScreen
          onComplete={() => {
            setLoading(false);
            window.__introDone = true;
            window.dispatchEvent(new Event("intro-complete"));
          }}
        />
      )}
    </div>
  );
}

export default App;
