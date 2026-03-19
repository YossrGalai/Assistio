<<<<<<< HEAD
import { BrowserRouter as Routes, Route, BrowserRouter } from "react-router-dom";
=======
import { BrowserRouter , Routes, Route } from "react-router-dom";
>>>>>>> 2a1491f67ca9cdabfd569088ce57538fc04a21d2
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD

=======
>>>>>>> 2a1491f67ca9cdabfd569088ce57538fc04a21d2

import RequestsMap from "./pages/Requests/RequestsMap";
import CreateRequest from "./pages/Requests/CreateRequest";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import "./App.css";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<RequestsMap />} />
          <Route path="/create" element={<CreateRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />  
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/requests" element={<Requests />} />  
          <Route path="/notifications" element={<Notifications />} />        
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

