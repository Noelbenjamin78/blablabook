import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
    return (
        <main className='bg-app-bg'>
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
                </Routes>
            </div>
        </main>
    );
}

export default App;
