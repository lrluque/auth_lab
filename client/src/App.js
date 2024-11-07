import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './views/home.js';
import Signup from './views/signup.js';
import Protected from './views/protected.js';
import { useState } from 'react';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={<Home setLoggedIn={setLoggedIn} setEmail={setEmail} />}
                />
                <Route
                    path="/signup"
                    element={<Signup />}
                />
                <Route
                    path="/protected"
                    element={<Protected />}
                />
            </Routes>
        </div>
    );
}

export default App;
