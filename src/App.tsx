import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatIBuild from "./components/WhatIBuild";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Closing from "./components/Closing";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-blueprint-bg text-blueprint-paper">
      <Navbar />
      <main>
        <Hero />
        <WhatIBuild />
        <Projects />
        <Experience />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
