
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import EditBook from "./pages/EditBook";
import MyRequests from "./pages/MyRequests";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:id" element={<BookDetails />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/add-book" element={<ProtectedRoute>    <AddBook />    </ProtectedRoute>    }/>
                        <Route path="/my-books" element={<ProtectedRoute>    <MyBooks />    </ProtectedRoute>   }/>
                        <Route path="/edit-book/:id" element={<ProtectedRoute> <EditBook /> </ProtectedRoute>}/>
                        <Route path="/my-requests" element={<ProtectedRoute>    <MyRequests />    </ProtectedRoute>}/>
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
