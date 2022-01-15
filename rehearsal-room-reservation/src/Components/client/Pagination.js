import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ clientsPerPage, totalClients, paginate }) {
    const clientsNumbers = [];

    for(let i = 1; i <= Math.ceil(totalClients / clientsPerPage); i++) { clientsNumbers.push(i); }
    
    return (
        <nav className="float-right">
            <ul className="pagination">
                {clientsNumbers.map(number => (
                    <li key={number} className="client-item">
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
