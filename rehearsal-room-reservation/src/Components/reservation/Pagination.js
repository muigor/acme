import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ reservationsPerPage, totalReservations, paginate }) {
    const reservationsNumbers = [];

    for(let i = 1; i <= Math.ceil(totalReservations / reservationsPerPage); i++) { reservationsNumbers.push(i); }
    
    return (
        <nav className="float-right">
            <ul className="pagination">
                {reservationsNumbers.map(number => (
                    <li key={number} className="reservation-item">
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
