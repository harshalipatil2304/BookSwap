import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home-container">
            <section className="hero-section">
                <p className="hero-label">WELCOME TO BOOKSWAP</p>

                <h1>
                    A New Chapter Begins
                    <br />
                    With Every Book.
                </h1>

                <p className="hero-description">
                    Discover books, exchange your favourites,
                    and give stories a second home.
                </p>

                <div className="hero-buttons">
                    <Link to="/books" className="primary-btn">
                        Explore Books
                    </Link>

                    <Link to="/add-book" className="secondary-btn">
                        Share Your Book
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Home;
