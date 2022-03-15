import React, { useState, useEffect } from 'react'
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv'

import { categoriesGetAll, categoriesGetOne, createCategories, updateCategories, deleteCategories } from "../../Webservices/endpoints";
import './categorie.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'

function Categorie() {

    const [creationError, setCreationError] = useState(null)
    const [listeCategories, setListeCategories] = useState([])
    const [valueType, setValueCategorie] = useState([])
    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [currentPage, setCurrentPage] = useState(1)
    const [categoriesPerPage, setCategoriesPerPage] = useState(6)

    /**
     * Hook to get all categories available
     */
    useEffect(() => {
        categoriesGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                if (listeCategories.length === 0) {
                    setListeCategories( (listeCategories) => data )
                }
            })
        
        return listeCategories;
    }, [listeCategories])

    const handleCategorieChange = e => {
        console.log(e.target.value);
        setValueCategorie(e.target.value);    
    }

    // show update form
    function isUpdateCategoryBtnClicked(id) {
        setShowUpdate({'isClicked': true, 'id': id})
        setValueCategorie(findTypeCategorieById(id));
        
    }

    function handleAnnuler(){
        setShowUpdate({'isClicked': false, 'id': null});
        setValueCategorie('')
        
    }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault();
        const type = e.target[0].value;

        createCategories(type)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                console.log(type);
                //console.log(data.nom[0]);
                if( data.type[0] === "Nom deja pris" ) {
                    setNotify({
                        isOpen: true,
                        message: "Nom deja pris",
                        type: "error",
                    })
                } else {
                    setListeCategories([])
                    setNotify({
                        isOpen: true,
                        message: "Catégorie ajoutée",
                        type: "success",
                    })
                }
            });
            setValueCategorie('');
    }

    // show update form
    function handleUpdate(e) {
        e.preventDefault();
        const type = e.target[0].value;
        updateCategories(showUpdate.id, type)
        .then(() => {
            setListeCategories([])
            setNotify({
                    isOpen: true,
                    message: "Catégorie mise à jour avec succès",
                    type: "success",
            })
            setShowUpdate({'isClicked': false, 'id': null})
        })
        setValueCategorie('');
    }

    // show update form
    function handleDelete(id) {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        })

        deleteCategories(id)
        .then((rq) => {
            if(rq.status === 404) {
                console.error('not found')
            } else {
                setListeCategories(listeCategories.filter(categ => categ.id !== id))
                
                setNotify({
                    isOpen: true,
                    message: "Catégorie supprimée",
                    type: "error",
                })
            }
        })
    }

        // Get current category
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;

    const currentCategories = listeCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    function findTypeCategorieById(id){
        if (listeCategories.length !== 0) {
            return listeCategories.find(elem => elem.id === id).type
        }
    }

    function handleAnnuler(){
        setShowUpdate({'isClicked': false, 'id': null});
        setValueCategorie('');
    }


    // change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const sortedList = currentCategories.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    
    // Display table rows of categories
    const categories = sortedList.map(categ => {
        return (
            <tr>
                <td>{categ.type}</td>
                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={categ.created_at} />
                </td>
                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        onClick={() => isUpdateCategoryBtnClicked(categ.id)} 
                    >
                        <i className="fas fa-pen"></i>
                    </button>
                </td>
                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-warning" 
                        onClick={() => { 
                            setConfirmDialog({
                                isOpen: true,
                                title:'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
                                subtitle:'vous ne pouvez plus récupérer cet élément',
                                onConfirm: () => { handleDelete(categ.id) }
                            })
                        }}
                    >
                            <i className="fas fa-times m-auto"></i>
                    </button>
                </td>
            </tr>
        );
    });

    const pageVariants = {
        initial: {
            opacity: 0,
            x: "-100%",
            scale: 0.8
        },
        in: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        out: {
            opacity: 0,
            x: "100%",
            scale: 1.2
        }
    }

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 1
    }

    return (
        <motion.div 
            className="container"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="row mt-4 my-row">
                <div className="add-category-form col-sm-4">
                    <form className="my-form" onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="mb-4">
                            <legend>{ !showUpdate.isClicked ? "Ajouter une catégorie" : "Modifier la catégorie"}</legend>
                            <hr />
                            <label htmlFor="typeCategorie" className="form-label">Nom : </label>
                            <input type="text" /*defaultValue= {showUpdate.isClicked ? findTypeCategorieById(showUpdate.id) : ""}*/ value={valueType} onChange={handleCategorieChange}   name="type" className="form-control" id="typeCategorie" required />
                        </div>
                        { !showUpdate.isClicked ? <button type="submit" className="btn btn-primary">Créer</button> : 
                            <div>
                                <button type="submit" className="btn btn-primary">Modifier</button>
                                <br />
                                <span 
                                    className="btn btn-outline-secondary btn-sm mt-3" 
                                    onClick={ handleAnnuler }
                                >
                                    Annuler la modification
                                </span>
                            </div>
                        }
                    </form>
                </div>

                <div className="view-categories col-sm-8">
                    <div className="row">
                        <h2 className="mb-4 col-sm-10">Liste des Catégories</h2>
                        <button className="btn btn-outline-primary mt-3 mb-3 col-sm-2">
                            <CSVLink data={listeCategories} filename="ListeCategories.csv">Exporter</CSVLink>
                        </button>
                    </div>
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr className="table-primary">
                                <th>Nom catégorie</th>
                                <th>Crée le</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            { categories }
                        </tbody>
                    </table>
                    <Pagination 
                        categoriesPerPage={categoriesPerPage} 
                        totalCategories={listeCategories.length}
                        paginate={paginate}
                    />
                </div>
            </div>
            <Notifications 
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </motion.div>
    )
}

export default Categorie
/*
var serializeJSON = function(data) {
    return Object.keys(data).map(function (keyName) {
      return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
  }
  
  var response = fetch(url, {
    method: 'POST',
    body: serializeJSON({
      haha: 'input'
    })
  });*/

  /*
  handleChange = (e) => {
 this.setState({...this.state.request_data, [event.data.target]: event.data.value})
}

        onSubmit = () => {
          console.log(this.state.request_data)   // you should be able to see your form data
      }

  */

/*
constructor(){
        super();
        this.state = {
            "profiles": [],
            material_id: null,
           start_data: null,
           end_data: null
        };

        this.handleChange = this.handleChange.bind(this)
    };

*/
  