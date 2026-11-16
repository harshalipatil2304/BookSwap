# 📚 BookSwap – Online Book Exchange Platform

BookSwap is a full-stack web application that allows users to discover, exchange, and give away books through an online platform.

The main goal of BookSwap is to encourage book reuse, make reading more accessible, and connect readers who want to share their books.

## ✨ Features

- **User Authentication:** Register and log in securely using JWT authentication.
- **Book Management:** Add, edit, view, and delete your own book listings.
- **Explore Books:** Browse available books and view book details.
- **Search and Filters:** Search books using keywords, categories, and book conditions.
- **Give Away:** Request books that other users want to give away.
- **Book Exchange:** Request an exchange with another user's book.
- **Request Management:** Accept, reject, or cancel exchange requests.
- **Handover Management:** Support book handover with confirmation from both users.
- **Ownership Transfer:** Transfer book ownership after successful completion.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Axios
- React Router

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Lombok
- Maven

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Eclipse / Spring Tool Suite
- MySQL Workbench
- Git and GitHub
- Postman

## 📂 Project Structure

```text
BookSwap/
│
├── book-swap/                     # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/bookswap/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── enums/
│   │       ├── exception/
│   │       ├── repository/
│   │       └── service/
│   │
│   └── src/main/resources/
│
├── Book-Swap-Frontend/
│   └── bookswap-frontend/          # React Frontend
│       ├── public/
│       └── src/
│           ├── api/
│           ├── assets/
│           ├── components/
│           ├── context/
│           ├── pages/
│           └── styles/
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/harshalipatil2304/BookSwap.git
cd BookSwap
```

### 2. Backend Setup

- Open the `book-swap` folder in Eclipse or Spring Tool Suite.
- Create a MySQL database named `bookswap_db`.
- Configure your database username, password, and JWT secret.
- Use `application-example.properties` as a configuration reference.
- Create your local `application.properties` file with your actual credentials.
- Run the `BookSwapApplication.java` file.

Backend runs at:

`http://localhost:8080`

### 3. Frontend Setup

Open a terminal inside:

`Book-Swap-Frontend/bookswap-frontend`

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 🔐 Security

- JWT-based authentication.
- Password encryption using Spring Security.
- Protected frontend routes.
- Backend authorization and ownership validation.
- CORS configuration for frontend-backend communication.
- Sensitive configuration files are excluded from Git.

## 🚀 Future Enhancements

- Buy and sell books at discounted prices.
- Online payment integration.
- Order management.
- Delivery tracking.
- Admin dashboard.
- User reviews and ratings.

## 👩‍💻 Developer

**Harshali Patil**

- GitHub: [harshalipatil2304](https://github.com/harshalipatil2304)

---

*BookSwap – Share Books, Spread Knowledge!*
