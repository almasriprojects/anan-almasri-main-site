import { useState } from "react";
import { createFileRoute } from '@tanstack/react-router';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhatIBuild from "../components/WhatIBuild";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Closing from "../components/Closing";
import Footer from "../components/Footer";
import AdminLoginModal from "../components/AdminLoginModal";

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blueprint-bg text-blueprint-paper">
      <Navbar onLoginClick={() => setAdminModalOpen(true)} />
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />
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
