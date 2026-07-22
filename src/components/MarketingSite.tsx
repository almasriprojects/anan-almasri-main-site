import { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import WhatIBuild from "./WhatIBuild";
import Projects from "./Projects";
import Experience from "./Experience";
import Closing from "./Closing";
import Footer from "./Footer";
import AdminLoginModal from "./AdminLoginModal";
import { BookCallProvider } from "./BookCallModal/context";

/**
 * The original marketing landing page — preserved at `/legacy` after the
 * Blueprint Eternity demo was promoted to the public homepage. All
 * structural decisions, copy, and styling match the pre-promotion version
 * so existing links, screenshots, and search results continue to work.
 */
export default function MarketingSite() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <BookCallProvider>
      <div className="min-h-screen bg-blueprint-bg text-blueprint-paper">
        <Navbar onLoginClick={() => setIsAdminOpen(true)} />
        <main>
          <Hero />
          <WhatIBuild />
          <Projects />
          <Experience />
          <Closing />
        </main>
        <Footer />
        <AdminLoginModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    </BookCallProvider>
  );
}
