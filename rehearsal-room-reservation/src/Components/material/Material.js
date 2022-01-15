import React, { useState, useEffect } from 'react'
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv'

import { materialsGetAll, materialsGetOne, createMaterial, updateMaterial, deleteMaterial } from "../../Webservices/endpoints";
import './material.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'

function Material() {

    const [creationError, setCreationError] = useState(null)
    const [listeMaterials, setListeMaterials] = useState([])
    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [currentPage, setCurrentPage] = useState(1)
    const [materialsPerPage, setMaterialsPerPage] = useState(6)
    
    /**
     * Hook to get all materials available
     */
     useEffect(() => {
        materialsGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                if (listeMaterials.length === 0) {
                    setListeMaterials( (listeMaterials) => data )
                }
            })
        
        return listeMaterials;
    }, [listeMaterials])

    // show update form
    function isUpdateMaterialBtnClicked(id) {
        setShowUpdate({'isClicked': true, 'id': id})
    }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault();
        const nom = e.target[0].value;

        createMaterial(nom)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                if( data.nom[0] === "Nom deja pris" ) {
                    setNotify({
                        isOpen: true,
                        message: "Nom deja pris",
                        type: "error",
                    })
                } else {
                    setListeMaterials([])
                    setNotify({
                        isOpen: true,
                        message: "Matériel ajouté",
                        type: "success",
                    })
                }
            });
    }

    // show update form
    function handleUpdate(e) {
        e.preventDefault();
        const nom = e.target[0].value;
        updateMaterial(showUpdate.id, nom)
        .then(() => {
            setListeMaterials([])
            setNotify({
                    isOpen: true,
                    message: "Matériel mis à jour avec succès",
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

        deleteMaterial(id)
        .then((rq) => {
            if(rq.status === 404) {
                console.error('not found')
            } else {
                setListeMaterials(listeMaterials.filter(materiel => materiel.id !== id))
                
                setNotify({
                    isOpen: true,
                    message: "Matériel supprimé",
                    type: "error",
                })
            }
        })
    }

        // Get current material
        const indexOfLastMaterial = currentPage * materialsPerPage;
        const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
    
        const currentMaterials = listeMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial);
    
    // change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const sortedList = currentMaterials.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    
    // Display table rows of materials
    const materials = sortedList.map(materiel => {
        return (
            <tr>
                <td>{materiel.nom}</td>
                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={materiel.created_at} />
                </td>
                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        onClick={() => isUpdateMaterialBtnClicked(materiel.id)} 
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
                                title:'Êtes-vous sûr de vouloir supprimer ce matériel ?',
                                subtitle:'vous ne pouvez plus récupérer cet élément',
                                onConfirm: () => { handleDelete(materiel.id) }
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
                <div className="add-material-form col-sm-4">
                    <form className="my-form" onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="mb-4">
                            <legend>{ !showUpdate.isClicked ? "Ajouter un matériel" : "Modifier le matériel"}</legend>
                            <hr />
                            <label htmlFor="nomMatériel" className="form-label">Nom : </label>
                            <input type="text" name="nom" className="form-control" id="nomMatériel" required />
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
                        <h2 className="mb-4 col-sm-10">Liste des Matériels</h2>
                        <button className="btn btn-outline-primary mt-3 mb-3 col-sm-2">
                            <CSVLink data={listeMaterials} filename="ListeMateriel.csv">Exporter</CSVLink>
                        </button>
                    </div>
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr className="table-primary">
                                <th>Nom matériel</th>
                                <th>Crée le</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            { materials }
                        </tbody>
                    </table>
                    <Pagination 
                        materialsPerPage={materialsPerPage} 
                        totalMaterials={listeMaterials.length}
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

export default Material
