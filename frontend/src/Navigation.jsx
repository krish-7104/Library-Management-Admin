import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
import Book from "./Screens/Dashboard/Books/Book";
import AddBook from "./Screens/Dashboard/Books/AddBook";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./AuthWrapper";
import IssueBook from "./Screens/Dashboard/Allotment/IssueBook";
import ReturnBook from "./Screens/Dashboard/Allotment/ReturnBook";
import Student from "./Screens/Dashboard/Student";
import Fines from "./Screens/Dashboard/Fines";
import MyAccount from "./Screens/Dashboard/MyAccount";
import Category from "./Screens/Dashboard/Category/Category";
import Allotments from "./Screens/Dashboard/Allotment/Allotments";
import SendMessage from "./Screens/Dashboard/SendMessage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/books"
          element={
            <AuthWrapper>
              <Book />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/add-book"
          element={
            <AuthWrapper>
              <AddBook />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/issue-book"
          element={
            <AuthWrapper>
              <IssueBook />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/return-book"
          element={
            <AuthWrapper>
              <ReturnBook />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/category"
          element={
            <AuthWrapper>
              <Category />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/allotments"
          element={
            <AuthWrapper>
              <Allotments />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/fines"
          element={
            <AuthWrapper>
              <Fines />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/students"
          element={
            <AuthWrapper>
              <Student />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/myaccount"
          element={
            <AuthWrapper>
              <MyAccount />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard/send-message"
          element={
            <AuthWrapper>
              <SendMessage />
            </AuthWrapper>
          }
        />
      </Routes>

      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
