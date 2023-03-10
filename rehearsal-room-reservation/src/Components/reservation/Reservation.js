import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CreateIcon from '@material-ui/icons/Create';
import DateTimePicker from 'react-datetime-picker';
import Moment from 'react-moment';
import { makeStyles, Paper } from '@material-ui/core';
import { reservationGetAll, createReservation, updateReservation, deleteReservation, salleGetAll, clientGetAll } from "../../Webservices/endpoints";
import './ReservationForm.css';
import './Reservation.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'


const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
        marginBottom: theme.spacing(1.2),
    }
}))
/*
function addDaysToDate(date date_debut, days){
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
}
*/

function Reservation() {
    const classes = useStyles();

    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})

    const [creationError, setCreationError] = useState(null)
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [valueDate, onChangeDate] = useState(new Date());
    const [valueDuree, setValueDuree] = useState('');
    const [valueClient, setValueClient] = useState('1');
    const [valueSalle, setValueSalle] = useState('');

    const [listeReservation, setListeReservation] = useState([])
    const [listeClient, setListeClient] = useState([])
    const [listeSalle, setListeSalle] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [reservationsPerPage, setReservationsPerPage] = useState(3)

    /**
     * Hook to get all reservations
     */
    useEffect(() => {
        reservationGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                if (listeReservation.length === 0) {
                    setListeReservation( (listeReservation) => data )
                }
            })
        
        return listeReservation;
    }, [listeReservation])

    /**
     * Hook to get all clients
     */
    useEffect(() => {
        clientGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeClient(data)
            })
    }, [])

    /**
     * Hook to get all rooms
     */
    useEffect(() => {
        salleGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeSalle(data)
            })
    }, [])

    const handleDureeChange = e => {
        setValueDuree(e.target.value);    
    }

    

    function isUpdateReservationBtnClicked(id) {
        setShowUpdate({'isClicked': true, 'id': id});
        setValueClient(findIdClientById(id));
        setValueSalle(findIdSalleById(id));
        setValueDuree(findDureeById(id));
        onChangeDate(findDateById(id));

    }

    const handleSelectClientChange = e => {
        console.log(e.target.value);
        setValueClient(e.target.value);    
    }

    const handleSelectSalleChange = e => {
        console.log(e.target.value);
        setValueSalle(e.target.value);    
    }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault();
        const Duree = parseInt(valueDuree, 10);

        createReservation(valueDate, Duree, valueSalle, valueClient)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                if (data.Salle[0] === "Salle d??j?? prise"){
                    setNotify({
                        isOpen: true,
                        message: "Salle d??j?? prise",
                        type: "error",
                    })
                } else {
                setListeReservation([])
                setNotify({
                    isOpen: true,
                    message: "R??servation ajout??e",
                    type: "success",
                })
                }
            }
        );

        setValueDuree('')
        onChangeDate(new Date());
        setValueClient('')
        setValueSalle('')
        
    }

    // show update form
    const handleUpdate = e => {
        e.preventDefault();
        const Duree = parseInt(valueDuree, 10);

        updateReservation(showUpdate.id, valueDate, Duree, valueSalle, valueClient)
        .then(() => {
            setListeReservation([])
            setNotify({
                    isOpen: true,
                    message: "Info r??servation mise ?? jour avec succ??s",
                    type: "success",
            })
            setShowUpdate({'isClicked': false, 'id': null})
        })
        setValueDuree('')
        onChangeDate(new Date());
        setValueClient('')
        setValueSalle('')
    }
    
    function handleDelete(id) {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        })

        deleteReservation(id)
        .then((rq) => {
            if(rq.status === 404) {
                console.error('not found')
            } else {
                setListeReservation(listeReservation.filter(reservation => reservation.id !== id))
                
                setNotify({
                    isOpen: true,
                    message: "R??servation annul??e",
                    type: "error",
                })
            }
        })
    }

    // Get current reservation
    const indexOfLastReservation = currentPage * reservationsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;

    const currentReservations = listeReservation.slice(indexOfFirstReservation, indexOfLastReservation);

    // change the page
    //const paginate = (pageNumber) => setCurrentPage(pageNumber)
/*
    //Fonction Reservation
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
      
      function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
      }
      
      function addHours(date, hours) {
        var result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
      }
      
      
      
      function reservationValide(dateCurrentReservation, dateNewReservation, unite, duree) {
          var valide;
        var dateEndCurrentReservation;
        if(unite=='Jours'){
            dateEndCurrentReservation=addDays(dateCurrentReservation,duree);
        }
        else if(unite=='Heures'){
            dateEndCurrentReservation=addHours(dateCurrentReservation,duree);
        }
        else{ //unite == minutes
            dateEndCurrentReservation=addMinutes(dateCurrentReservation,duree);
        }
        //dateCurrentReservation va etre remani??e
          if(new Date(dateEndCurrentReservation) < new Date(dateNewReservation)){
          valide=true;
          //alert('true');
          }
      
          if(new Date(dateEndCurrentReservation) > new Date(dateNewReservation)){
          valide=false;
          //alert('false');
          }
        return valide ;
      } */

    function findDateById(id){
        if(listeReservation.length !== 0) {
            return listeReservation.find(elem => elem.id === id).dateDebut
        }
    }

    function findIdClientById(id){
        if(listeReservation.length !== 0) {
            return listeReservation.find(elem => elem.id === id).client
        }
    }

    function findIdSalleById(id){
        if(listeReservation.length !== 0) {
            return listeReservation.find(elem => elem.id === id).Salle
        }
    }


    function findDureeById(id){
        if(listeReservation.length !== 0) {
            return listeReservation.find(elem => elem.id === id).duree
        }
    }

    function findNomClientById(id) {
        if (listeClient.length !== 0) {
            return listeClient.find(elem => elem.id === id).nom
        }
    }

    function findNumSalleById(id) {
        if (listeSalle.length !== 0) {
            return listeSalle.find(elem => elem.id === id).numero
        }
    }

    function handleAnnuler(){
        setShowUpdate({'isClicked': false, 'id': null});
        onChangeDate(new Date());
        setValueClient('');
        setValueDuree('');
        setValueSalle('');
    }

    //change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const sortedList = currentReservations.sort((a,b) =>(a.created_at < b.created_at) ? 1 : -1)
    
    // Display table rows of categories
    //const reservations = sortedList.map
    const reservations = sortedList.map(reservation => {
        console.log(reservation)
        return (
            <tr>
                <td><Moment format="DD/MM/YYYY - H:mm:ss" date={reservation.dateDebut} /></td>
                <td>{reservation.duree} Heures</td>
                <td>{ findNomClientById(reservation.client) }</td>
                <td>{ findNumSalleById(reservation.Salle) }</td>

                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={reservation.created_at} />
                </td>

                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        /*onClick={() => setShowUpdate({'isClicked': true, 'id': reservation.id})*/
                        onClick={() => isUpdateReservationBtnClicked(reservation.id)} 
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
                                title:"??tes-vous s??r d'annuller cette r??servation ?",
                                subtitle:'vous ne pouvez plus r??cup??rer cet ??l??ment',
                                onConfirm: () => { handleDelete(reservation.id) }
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
            <Paper className={classes.pageContent}>
                <div className="reservationForm container">
                    <div className="reservationForm__Header">
                        {!showUpdate.isClicked ? 
                            <AddBoxIcon className="add-icon" /> :
                            <CreateIcon className="update-icon" />
                        }
                        <div className="reservationForm__Header_info">
                            { 
                            !showUpdate.isClicked ?
                            <>
                                <h4 className="reservationForm__Header_title">Nouvelle R??servation</h4>
                                <p>Faites une r??servation</p>
                            </> : <>
                                <h4 className="reservationForm__Header_title">Nouvelle Donn??es</h4>
                                <p>Modifier les informations de la r??servation</p>
                            </>
                            }
                        </div>
                        {showUpdate.isClicked ? 
                            <span 
                                className="btn btn-outline-secondary btn-sm btn-annuller" 
                                onClick={handleAnnuler}
                            >
                                Annuler la modification
                            </span> : <></>}
                    </div>
                    <hr />
                    <form onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="row">
                            <div className="form-group col-sm-6 row">
                                <label htmlFor="inputDateDebut" className="col-sm-2 col-form-label">D??but</label>
                                <div className="col-sm-10">
                                    <DateTimePicker
                                        onChange={onChangeDate}
                                        value={valueDate}
                                        className="gradient-border"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-sm-6 row">
                                <label htmlFor="inputDuree" className="col-sm-2 col-form-label">Dur??e(H)</label>
                                <div className="col-sm-10">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="inputDuree"
                                        value={valueDuree}
                                        onChange={handleDureeChange} 
                                        placeholder="Entrer la dur??e"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group col-sm-6 row">
                                <label htmlFor="selectClient" className="col-sm-2 col-form-label">Client</label>
                                <div className="col-sm-10">
                                    <select value={valueClient} onChange={handleSelectClientChange} className="form-control" id="selectClient" required> 
                                        <option value="">Choisissez un client</option>
                                        
                                        {
                                            listeClient.map((client) =>
                                            
                                                <option key={client.id} value={client.id}>{client.nom}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group col-sm-6 row">
                                <label htmlFor="selectSalle" className="col-sm-2 col-form-label">Salle</label>
                                <div className="col-sm-10">
                                    <select value={valueSalle} onChange={handleSelectSalleChange} className="form-control" id="selectSalle" required>
                                        <option value="">Choisissez une salle</option>
                                        {
                                            listeSalle.map((salle) =>
                                                <option key={salle.id} value={salle.id}>{salle.numero}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="send-group">
                        { 
                            !showUpdate.isClicked ?
                            <button type="submit" className="btn btn-creer col-sm-2">Cr??er</button>
                            : <button type="submit" className="btn btn-modifier col-sm-2">Modifier</button>
                        }
                        </div>
                    </form>
                </div>
            </Paper>

            <div className="view-reservations container">
                <div className="row">
                    <h3 className="mb-2 col-sm-10">Liste de r??servations</h3>
                    <button className="btn btn-outline-primary mb-2 col-sm-2">
                        <CSVLink data={listeReservation} filename="ListeReservation.csv">Exporter</CSVLink>
                    </button>
                </div>
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr className="table-primary">
                            <th>Date de d??but</th>
                            <th>Dur??e</th>
                            <th>Client</th>
                            <th>Salle</th>
                            
                            <th>Cr??e le</th>
                            <th>Modifier</th>
                            <th>Annuler</th>
                        </tr>
                    </thead>
                    <tbody>
                        { reservations }
                    </tbody>
                </table>
                <Pagination 
                    reservationsPerPage={reservationsPerPage} 
                    totalReservations={listeReservation.length}
                    paginate={paginate}
                />
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

export default Reservation
