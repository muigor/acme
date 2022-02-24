import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { motion } from 'framer-motion';

import './App.css';

import { categoriesGetAll, materialsGetAll, salleGetAll, clientGetAll, reservationGetAll } from "../Webservices/endpoints";

function App() {

    const [totalCategories, setTotalCategories] = useState(0)
    const [totalMaterials, setTotalMaterials]   = useState(0)
    const [totalSalles, setTotalSalles]         = useState(0)
    const [listeClients, setListeClients]       = useState([])
    const [listeSalles, setListeSalles]       = useState([])
    const [listeReservations, setListeReservations] = useState([])


    // Hook to get total number of categories
    useEffect(() => {
        categoriesGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setTotalCategories(data.length)
            })
        
        return totalCategories;
    }, []);

    // Hook to get total number of materials
    useEffect(() => {
        materialsGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setTotalMaterials(data.length)
            })
        
        return totalMaterials;
    }, []);

    // Hook to get total number of rooms
    useEffect(() => {
        salleGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setTotalSalles(data.length)
            })
        
        return totalSalles;
    }, []);

    // Hook to get total number of clients
    useEffect(() => {
        clientGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeClients(data)
            })
        
        return listeClients;
    }, []);

    useEffect(() => {
        salleGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeSalles(data)
            })
        
        return listeSalles;
    }, []);

    // Hook to get total all reservations
    useEffect(() => {
        reservationGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeReservations(data)
            })
        
        return listeReservations;
    }, []);

    function findNomClientById(id) {
        if (listeClients.length !== 0) {
            return listeClients.find(elem => elem.id === id).nom
        }
    }

    function findNumSalleById(id) {
        if (listeSalles.length !== 0) {
            return listeSalles.find(elem => elem.id === id).numero
        }
    }

    const sortedList = listeReservations.sort((a, b) => (a.date_created < b.date_created) ? 1 : -1)

    // Display table of recent reservations (only 6 rows)
    const reservationRecentes = sortedList.slice(0, 6).map( reserv => {
        console.log(reserv)
        console.log("fonction")
        //console.log(findNomClientById(reserv.client.id))
        return(
            <tr>
                <td><Moment format="DD/MM/YYYY - H:mm:ss" date={reserv.dateDebut} /></td>
                <td>{reserv.duree + reserv.unite}</td>
                <td>{ findNomClientById(reserv.client) }</td>
                <td>{findNumSalleById(reserv.Salle)}</td>
            </tr>
        );
    })

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
            className="App"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <section className="s1">
                <div className="main-container" id="total-items">
                    <div className="cards-wrapper">
                        <div className="my-card card-preview1 border-primary">
                            <h6 className="card-title"> Nombre De Catégories </h6> <hr />
                            <p className="card-number"> {totalCategories} </p>
                        </div>

                        <div className="my-card card-preview2 border-primary">
                            <h6 className="card-title"> Nombre De Matériels </h6> <hr />
                            <p className="card-number"> {totalMaterials} </p>
                        </div>

                        <div className="my-card card-preview3 border-primary">
                            <h6 className="card-title"> Nombre De Salles </h6> <hr />
                            <p className="card-number"> {totalSalles} </p>
                        </div>

                        <div className="my-card card-preview4 border-primary">
                            <h6 className="card-title"> Nombre De Clients </h6> <hr />
                            <p className="card-number"> {listeClients.length} </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="s2">
                <div className="main-container" id="reserv">
                    <div className="row my-row">
                        <div className="my-card-spec border-primary bg-dark col-sm-3">
                            <h6 className="card-title"> Total de réservations </h6> <hr />
                            <p className="card-number"> {listeReservations.length} </p>
                        </div>

                        <div className="col-sm-9">
                            <h2 className="mb-4">Réservations récentes</h2>
                            <table className="table table-dark table-striped table-hover">
                                <thead>
                                    <tr className="table-primary">
                                        <th>Date</th>
                                        <th>Durée</th>
                                        <th>Client</th>
                                        <th>Salle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { reservationRecentes }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default App;
