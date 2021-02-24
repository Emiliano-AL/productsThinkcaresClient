import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>React - CRUD</h1>
            <p>Acciones CRUD para fines demostrativos</p>
            <p><Link to="products">&gt;&gt; Administrar productos</Link></p>
        </div>
    );
}

export { Home };