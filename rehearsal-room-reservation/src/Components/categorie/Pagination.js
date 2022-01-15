import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ categoriesPerPage, totalCategories, paginate }) {
    const categoriesNumbers = [];

    for(let i = 1; i <= Math.ceil(totalCategories / categoriesPerPage); i++) { categoriesNumbers.push(i); }
    
    return (
        <nav className="float-right">
            <ul className="pagination">
                {categoriesNumbers.map(number => (
                    <li key={number} className="category-item">
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
