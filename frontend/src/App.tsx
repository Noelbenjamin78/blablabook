import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Library from './components/library/Library';
import BooksRead from './components/library/BooksRead';
import BooksToRead from './components/library/BooksToRead';

function App() {
    return (
        <main className="bg-app-bg h-full w-full">
            <div>
                <Routes>
                    <Route path="/" element={<div>Accueil</div>} />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={function (email: string, password: string): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onRegister={function (email: string, password: string): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        }
                    />
                    <Route path="/library" element={<Library />} />
                    <Route path="/library/books-read" element={<BooksRead />} />
                    <Route path="/library/books-to-read" element={<BooksToRead />} />
                </Routes>
            </div>
        </main>
    );
}

export default App;
