import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface NavbarState {
  expandedItems: { [key: number]: boolean };
  navScrollPosition: number;
  setExpandedItems: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
  setNavScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}
 
const NavbarContext = createContext<NavbarState | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar debe usarse dentro de un NavbarProvider");
  }
  return context;
};

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});
  const [navScrollPosition, setNavScrollPosition] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setExpandedItems({});
      setNavScrollPosition(0);
    }
  }, [isAuthenticated]);

  return (
    <NavbarContext.Provider
      value={{ expandedItems, setExpandedItems, navScrollPosition, setNavScrollPosition }}
    >
      {children}
    </NavbarContext.Provider>
  );
};