import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CanvasPage from "./pages/CanvasPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/canvas" element={<CanvasPage />} />
    </Routes>
  );
}
