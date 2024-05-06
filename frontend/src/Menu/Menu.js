import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// import './Menu.css'; // Import your CSS file

function Menu() {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  };

  return (
    <div className='menuBox'>
      <div>
        <div className="menu">

        <Link to="/dashboard">
          <button className='menuButton'>Home</button>
        </Link>

        <Link to="/configure-budgets">
            <button className='menuButton'>Configure Budgets</button>
          </Link>

          <Link to="/add-expense">
            <button className='menuButton'>Manage Expenses</button>
          </Link>

          <Link to="/Visual">
          <button className='menuButton'>Visuals</button>
          </Link>

          <Link to="/" onClick={handleLogout}>
            <button className='menuButton'>Logout</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
