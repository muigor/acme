import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ sallesPerPage, totalSalles, paginate }) {
    const sallesNumbers = [];

    for(let i = 1; i <= Math.ceil(totalSalles / sallesPerPage); i++) { sallesNumbers.push(i); }
    
    return (
        <nav className="float-right">
            <ul className="pagination">
                {sallesNumbers.map(number => (
                    <li key={number} className="salle-item">
                        <Link 
                            className="page-link"
                            onClick={() => paginate(number)}
                        >
                            {number}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination
