import { useEffect } from "react";
import Calculator from "./components/Calculator";
export default function App() {
  useEffect(() => {
    const preventDefault = (event) => event.preventDefault();

    document.addEventListener("gesturestart", preventDefault, { passive: false });
    document.addEventListener("gesturechange", preventDefault, { passive: false });
    document.addEventListener("gestureend", preventDefault, { passive: false });

    

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
      document.removeEventListener("gestureend", preventDefault);    };
  }, []);

  return <Calculator />;
}
