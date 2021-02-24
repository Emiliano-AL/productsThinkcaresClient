import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>React - CRUD</h1>
            <p>An example app showing how to list, add, edit and delete user records with React and the React Hook Form library.</p>
            <p><Link to="products">&gt;&gt; Administrar productos</Link></p>
        </div>
    );
}

export { Home };