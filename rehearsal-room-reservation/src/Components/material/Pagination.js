import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ materialsPerPage, totalMaterials, paginate }) {
    const materialsNumbers = [];

    for(let i = 1; i <= Math.ceil(totalMaterials / materialsPerPage); i++) { materialsNumbers.push(i); }
    
    return (
        <nav className="float-right">
            <ul className="pagination">
                {materialsNumbers.map(number => (
                    <li key={number} className="material-item">
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
