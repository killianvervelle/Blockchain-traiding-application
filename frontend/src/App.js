import '../src/App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sign_registr from './pages/Sign_registr';
import Transac_status from './pages/Transac_status';
import Wallet_integ from './pages/Wallet_integ';
import Database_integ from './pages/Database_integ';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Lostpwd from './pages/Lostpwd';
import RegisterForm from './pages/Register';
import Charts from './pages/Charts';
import Tables from './pages/Tables';
import ActivityLog from './pages/ActivityLog';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';


function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <div className="side-by-side">
          <Navigation />
          <div className='top-by-top'>
            <div className="topbar">
            <Topbar />
            </div>
            <Routes>
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/signature-registration" exact element={<Sign_registr />} />
              <Route path="/transaction-status" exact element={<Transac_status />} />
              <Route path="/wallet-integration" exact element={<Wallet_integ />} />
              <Route path="/database-integration" exact element={<Database_integ />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" exact element={<RegisterForm />} />
              <Route path="/lostpassword" exact element={<Lostpwd />} />
              <Route path="/charts" exact element={<Charts />} />
              <Route path="/tables" exact element={<Tables />} /> 
              <Route path="/userprofile" exact element={<UserProfile />} />
              <Route path="/settings" exact element={<Settings />} />
              <Route path="/log" exact element={<ActivityLog />} />
            </Routes>
            </div>
          </div>
      </Router>
    </div>
  );
}

export default App;
