import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/products" className="nav-item nav-link">Productos</NavLink>
                <NavLink to="/companies" className="nav-item nav-link">Empresas</NavLink>
            </div>
        </nav>
    );
}

export { Nav };