import { createContext, useContext, useState, type ReactNode } from "react";
import BookCallModal from "./BookCallModal.tsx";

interface BookCallContextValue {
  openBookCall: () => void;
  closeBookCall: () => void;
}

const BookCallContext = createContext<BookCallContextValue | null>(null);

export function useBookCall() {
  const ctx = useContext(BookCallContext);
  if (!ctx) throw new Error("useBookCall must be used within BookCallProvider");
  return ctx;
}

export function BookCallProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookCallContext.Provider
      value={{
        openBookCall: () => setIsOpen(true),
        closeBookCall: () => setIsOpen(false),
      }}
    >
      {children}
      <BookCallModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookCallContext.Provider>
  );
}
