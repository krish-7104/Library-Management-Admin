import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
import Book from "./Screens/Dashboard/Books/Book";
import AddBook from "./Screens/Dashboard/Books/AddBook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/books" element={<Book />} />
        <Route path="/dashboard/addbook" element={<AddBook />} />
      </Routes>
    </Router>
  );
}

export default App;
