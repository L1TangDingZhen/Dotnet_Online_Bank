import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lo from './Login/login';
import Wel from './Welcome/wel';
import Mon from './Money/money'
import Pay from './Payments/pay'
import Reg from './Re/register'
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Routes>
                        <Route path="/" element={<Wel />} />
                        <Route path="/login" element={<Lo />} />
                        <Route path="/money" element={<Mon />} />
                        <Route path="/payments" element={<Pay />} />
                        <Route path="/register" element={<Reg />} />


                        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* 404 ҳ�� */}

                    </Routes>
                </Router>
            </header>
        </div>
    );
}

export default App;
