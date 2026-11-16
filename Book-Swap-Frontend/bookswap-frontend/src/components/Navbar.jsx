
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>
            <h2>BookSwap</h2>

            <div>
                <Link to="/">Home</Link>
                <Link to="/books">Explore Books</Link>

                {isLoggedIn && (
                    <>
                        <Link to="/add-book">Add Book</Link>
                        <Link to="/my-books">My Books</Link>
                        <Link to="/my-requests">My Requests</Link>

                        <span style={{ color: 'orange' }}> Hi, {user.fullName}</span>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}

                {!isLoggedIn && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
