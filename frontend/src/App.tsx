import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestsMap from "./pages/Requests/RequestsMap";
import CreateRequest from "./pages/Requests/CreateRequest";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<RequestsMap />} />
        <Route path="/create" element={<CreateRequest />} />
      </Routes>
    </Router>
  );
}

export default App;