import React, { useState, useEffect } from 'react'
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv'

import { clientGetAll, clientGetOne, createClient, updateClient, deleteClient } from "../../Webservices/endpoints";
import './client.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'

function Client() {

    const [creationError, setCreationError] = useState(null)
    const [listeClients, setListeClients] = useState([])
    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [currentPage, setCurrentPage] = useState(1)
    const [clientsPerPage, setClientsPerPage] = useState(6)

    /**
     * Hook to get all clients available
     */
     useEffect(() => {
        clientGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                if (listeClients.length === 0) {
                    setListeClients( (listeClients) => data )
                }
            })
        
        return listeClients;
    }, [listeClients])

    // show update form
    function isUpdateClientBtnClicked(id) {
        setShowUpdate({'isClicked': true, 'id': id})
    }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault();
        const nom = e.target[0].value;

        createClient(nom)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                console.log(nom);
                if( data.nom[0] === "Nom deja pris" ) {
                    setNotify({
                        isOpen: true,
                        message: "Nom deja pris",
                        type: "error",
                    })
                } else {
                    setListeClients([])
                    setNotify({
                        isOpen: true,
                        message: "Client ajouté",
                        type: "success",
                    })
                }
            });
    }

    // show update form
    function handleUpdate(e) {
        e.preventDefault();
        const nom = e.target[0].value;
        updateClient(showUpdate.id, nom)
        .then(() => {
            setListeClients([])
            setNotify({
                    isOpen: true,
                    message: "Client mise à jour avec succès",
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

        deleteClient(id)
        .then((rq) => {
            if(rq.status === 404) {
                console.error('not found')
            } else {
                setListeClients(listeClients.filter(client => client.id !== id))
                
                setNotify({
                    isOpen: true,
                    message: "Client supprimé",
                    type: "error",
                })
            }
        })
    }
        /*console.log(clients)*/
        // Get current client
        const indexOfLastClient = currentPage * clientsPerPage;
        const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    
        const currentClients = listeClients.slice(indexOfFirstClient, indexOfLastClient);

        function findNomCategorieById(id){
            if (listeClients.length !== 0) {
                return listeClients.find(elem => elem.id === id).nom
            }
        }

        // change the page
        const paginate = (pageNumber) => setCurrentPage(pageNumber)
        const sortedList = currentClients.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
        
        // Display table rows of categories
        const clients = sortedList.map(client => {

    return (
        <tr>
                <td>{client.nom}</td>
                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={client.created_at} />
                </td>
                <td>
                <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        onClick={() => isUpdateClientBtnClicked(client.id)} 
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
                                title:'Êtes-vous sûr de vouloir supprimer ce client ?',
                                subtitle:'vous ne pouvez plus récupérer cet élément',
                                onConfirm: () => { handleDelete(client.id) }
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
                <div className="add-client-form col-sm-4">
                    <form className="my-form" onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="mb-4">
                            <legend>{ !showUpdate.isClicked ? "Ajouter un client" : "Modifier le client"}</legend>
                            <hr />
                            <label htmlFor="nomClient" className="form-label">Nom : </label>
                            <input type="text"  defaultValue= {showUpdate.isClicked ? findNomCategorieById(showUpdate.id) : ""}   name="nom" className="form-control" id="nomClient" required />
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
                <div className="view-clients col-sm-8">
                    <div className="row">
                        <h2 className="mb-4 col-sm-10">Liste des Clients</h2>
                        <button className="btn btn-outline-primary mt-3 mb-3 col-sm-2">
                            <CSVLink data={listeClients} filename="ListeClients.csv">Exporter</CSVLink>
                        </button>
                    </div>
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr className="table-primary">
                                <th>Nom client</th>
                                <th>Crée le</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            { clients }
                        </tbody>
                    </table>
                    <Pagination 
                        clientsPerPage={clientsPerPage} 
                        totalClients={listeClients.length}
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


export default Client
