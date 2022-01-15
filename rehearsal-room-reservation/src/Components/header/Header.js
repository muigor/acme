import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">ACME - Studio</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/categorie">Catégories</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/material">Materials</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/salle">Salles</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/client">Clients</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/reservation">Réservations</Link>
                        </li>
                    </ul>
                
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="text" placeholder="Search" />
                        <IconButton color="inherit">
                            <SearchOutlined />
                        </IconButton>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Header
