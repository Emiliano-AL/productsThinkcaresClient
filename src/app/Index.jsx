import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Nav, Alert } from '@/_components';
import { Home } from '@/home';
import { Companies } from '@/companies';
import { Products } from '@/products';

function App() {
    const { pathname } = useLocation();  

    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="container pt-4 pb-4">
                <Switch>
                    <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                    <Route exact path="/" component={Home} />
                    <Route path="/products" component={Products} />
                    <Route path="/companies" component={Companies} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
        </div>
    );
}

export { App }; 