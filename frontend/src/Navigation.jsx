import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
import Book from "./Screens/Dashboard/Books/Book";
import AddBook from "./Screens/Dashboard/Books/AddBook";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/books" element={<Book />} />
        <Route path="/dashboard/addbook" element={<AddBook />} />
      </Routes>
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
