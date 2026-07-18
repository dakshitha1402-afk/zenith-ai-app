"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type PetContextType = {
  petMessage: string;
  showPetMessage: (message: string, duration?: number) => void;
  clearPetMessage: () => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [petMessage, setPetMessage] = useState("");

  const clearPetMessage = useCallback(() => {
    setPetMessage("");
  }, []);

  const showPetMessage = useCallback(
    (message: string, duration: number = 3000) => {
      setPetMessage(message);

      if (duration > 0) {
        setTimeout(() => {
          setPetMessage("");
        }, duration);
      }
    },
    []
  );

  return (
    <PetContext.Provider
      value={{
        petMessage,
        showPetMessage,
        clearPetMessage,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error("usePet must be used inside a PetProvider");
  }

  return context;
}
