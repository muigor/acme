import React, { useState, useEffect } from 'react'
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv'

import { salleGetAll, salleGetOne,createSalle, deleteSalle, updateSalle } from "../../Webservices/endpoints";
import './salle.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'

function Salle() {

    const [creationError, setCreationError] = useState(null)
    const [listeSalles, setListeSalles] = useState([])
    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [currentPage, setCurrentPage] = useState(1)
    const [sallesPerPage, setSallesPerPage] = useState(6)
    
    /**
     * Hook to get all salles available
     */
     useEffect(() => {
        salleGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                if (listeSalles.length === 0) {
                    setListeSalles( (listeSalles) => data )
                }
            })
        
        return listeSalles;
    }, [listeSalles])

    // show update form
    function isUpdateSalleBtnClicked(id) {
        setShowUpdate({'isClicked': true, 'id': id})
    }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault();
        const numero = e.target[0].value;

        createSalle(numero)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                if( data.numero[0] === "Numero deja pris" ) {
                    setNotify({
                        isOpen: true,
                        message: "Numero deja pris",
                        type: "error",
                    })
                } else {
                    setListeSalles([])
                    setNotify({
                        isOpen: true,
                        message: "Salle ajoutée",
                        type: "success",
                    })
                }
            });
    }

    // show update form
    function handleUpdate(e) {
        e.preventDefault();
        const numero = e.target[0].value;
        updateSalle(showUpdate.id, numero)
        .then(() => {
            setListeSalles([])
            setNotify({
                    isOpen: true,
                    message: "Salle mise à jour avec succès",
                    type: "success",
            })
            setShowUpdate({'isClicked': false, 'id': null})
        })
    }

    // show update form
    function handleDelete(id) {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        })

        deleteSalle(id)
        .then((rq) => {
            if(rq.status === 404) {
                console.error('not found')
            } else {
                setListeSalles(listeSalles.filter(salle => salle.id !== id))
                
                setNotify({
                    isOpen: true,
                    message: "Salle supprimée",
                    type: "error",
                })
            }
        })
    }

        // Get current room
        const indexOfLastSalle = currentPage * sallesPerPage;
        const indexOfFirstSalle = indexOfLastSalle - sallesPerPage;
    
        const currentSalles = listeSalles.slice(indexOfFirstSalle, indexOfLastSalle);
    
    // change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const sortedList = currentSalles.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    
    // Display table rows of salles
    const salles = sortedList.map(salle => {
        return (
            <tr>
                <td>{salle.numero}</td>
                <td>{salle.description}</td>
                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={salle.created_at} />
                </td>
                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        onClick={() => isUpdateSalleBtnClicked(salle.id)} 
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
                                title:'Êtes-vous sûr de vouloir supprimer cette salle ?',
                                subtitle:'vous ne pouvez plus récupérer cet élément',
                                onConfirm: () => { handleDelete(salle.id) }
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
                <div className="add-salle-form col-sm-4">
                    <form className="my-form" onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="mb-4">
                            <legend>{ !showUpdate.isClicked ? "Ajouter une salle" : "Modifier la salle"}</legend>
                            <hr />
                            <label htmlFor="numeroSalle" className="form-label">Numero : </label>
                            <input type="text" name="numero" className="form-control" id="numeroSalle" required />
                            <label htmlFor="descriptionSalle" className="form-label">Déscription : </label>
                            <input type="text" name="description" className="form-control" id="descriptionSalle" required />
                        </div>
                        { !showUpdate.isClicked ? <button type="submit" className="btn btn-primary">Créer</button> : 
                            <div>
                                <button type="submit" className="btn btn-primary">Modifier</button>
                                <br />
                                <span 
                                    className="btn btn-outline-secondary btn-sm mt-3" 
                                    onClick={() => setShowUpdate({'isClicked': false, 'id': null})}
                                >
                                    Annuler la modification
                                </span>
                            </div>
                        }
                    </form>
                </div>

                <div className="view-materials col-sm-8">
                    <div className="row">
                        <h2 className="mb-4 col-sm-10">Liste des Salles</h2>
                        <button className="btn btn-outline-primary mt-3 mb-3 col-sm-2">
                            <CSVLink data={listeSalles} filename="ListeSallz.csv">Exporter</CSVLink>
                        </button>
                    </div>
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr className="table-primary">
                                <th>Numéro Salle</th>
                                <th>Déscription de la salle</th>
                                <th>Crée le</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            { salles }
                        </tbody>
                    </table>
                    <Pagination 
                        sallesPerPage={sallesPerPage} 
                        totalSalles={listeSalles.length}
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

export default Salle
