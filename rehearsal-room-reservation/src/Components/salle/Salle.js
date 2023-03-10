import React, { useState, useEffect,Component } from 'react'
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv'

import { salleGetAll, salleGetOne,createSalle, deleteSalle, updateSalle,categoriesGetAll } from "../../Webservices/endpoints";
import './salle.css';

import Notifications from '../Notifications'
import ConfirmDialog from '../ConfirmDialog'
import Pagination from './Pagination'



function Salle() {
    

    const [creationError, setCreationError] = useState(null)
    const [listeSalles, setListeSalles] = useState([])
    const [valueDescription, setValueDescription] = useState('');
    const [valueNumero, setValueNumero] = useState('');
    const [valueCategorie, setValueCategorie] = useState('');
    const [listeCategories, setListeCategories] = useState([])
    const [showUpdate, setShowUpdate] = useState({'isClicked': false, 'id': null})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subtitle:''})

    const [currentPage, setCurrentPage] = useState(1)
    const [sallesPerPage, setSallesPerPage] = useState(6)
    


    /**What i added */
    /**
     * Hook to get all categories
     */
     useEffect(() => {
        categoriesGetAll()
        .then((rqResult) => rqResult.json())
            .then((data) => {
                setListeCategories(data)
            })
    }, [])
    

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
        setShowUpdate({'isClicked': true, 'id': id});
        setValueCategorie(findIdCategorieById(id));
        setValueDescription(findDescriptionSalleById(id));
        setValueNumero(findNumeroSalleById(id))
    }

    function handleAnnuler(){
        setShowUpdate({'isClicked': false, 'id': null});
        setValueCategorie('')
        setValueNumero('')
        setValueDescription('')
    }

    const handleSelectCategorieChange = e => {
        console.log(e.target.value);
        setValueCategorie(e.target.value);    
    }

    const handleNumeroChange = e => {
        console.log(e.target.value);
        setValueNumero(e.target.value);    
    }

    // What i added
    const handleSelectDescription = e => {
        console.log(e.target.value);
        setValueDescription(e.target.value);
       }

    function handleCreate(e) {
        if(creationError) {setCreationError(false);}
        e.preventDefault(); 
        //const numero = parseInt(valueNumero,10)
        const numero = e.target[0].value
        const description = e.target[1].value

        createSalle(numero,description,valueCategorie)
        .then((rqResult) => rqResult.json())
            .then((data) => {
                console.log(data);
                if( data.numero[0] === "Salle d??j?? ajout??e" ) {
                    setNotify({
                        isOpen: true,
                        message: "Salle d??j?? ajout??e",
                        type: "error",
                    })
                } else {
                    setListeSalles([]);
                    setNotify({
                        isOpen: true,
                        message: "Salle ajout??e",
                        type: "success",
                    });
                    setValueCategorie(0);
                    setValueNumero('');
                    setValueDescription('');
                }

                
                
            });
        
            
            // setValueCategorie('')
            // setValueNumero('')
            // setValueDescription('')
            

      
    }
/*
    function changeState() { 
        setValueNumero('');
         // change state
      }

    /*onHandleSubmit(e) ;{
    e.preventDefault();
    const numero = this.state.numero;
    this.props.onSearchTermChange(numero);
    this.setState({
        city: ''
    });
    }*/

    // show update form
    function handleUpdate(e) {
        e.preventDefault();
        const numero = e.target[0].value;
        //console.log("le numero" + numero)
        const description = e.target[1].value;
        //console.log("la d??scription" + description)
        updateSalle(showUpdate.id, numero,description,valueCategorie)
        .then(() => {
            setListeSalles([])
            setNotify({
                    isOpen: true,
                    message: "Salle mise ?? jour avec succ??s",
                    type: "success",
            })
            setShowUpdate({'isClicked': false, 'id': null})
        })
        //setValueCategorie('')
        setValueCategorie(0);
        setValueNumero('');
        setValueDescription('');
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
                    message: "Salle supprim??e",
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

    /**What i added */
    function findTypeCategorieById(id) {
        if (listeCategories.length !== 0) {
            return listeCategories.find(elem => elem.id === id).type
        }
    }

    function findIdCategorieById(id) {
        if (listeSalles.length !== 0) {
            return listeSalles.find(elem => elem.id === id).categorie
        }
    }

    function findNumeroSalleById(id) {
        if (listeSalles.length !== 0) {
            return listeSalles.find(elem => elem.id === id).numero
        }
    }

    function findDescriptionSalleById(id) {
        if (listeSalles.length !== 0) {
            return listeSalles.find(elem => elem.id === id).description
        }
    }

    
    
    const sortedList = currentSalles.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    
    // Display table rows of salles
    const salles = sortedList.map(salle => {
        
        /*console.log(salle.id)*/
        //console.log(findTypeCategorieById(salle.categorie))
        return (
            <tr>
                <td>{salle.numero}</td>
                <td>{findTypeCategorieById(salle.categorie)}</td>
                <td>{salle.description}</td>
                <td>
                    <Moment format="DD/MM/YYYY - H:mm:ss" date={salle.created_at} />
                </td>
                <td>
                    <button 
                        type="button" 
                        className="btn btn-outline-info" 
                        onClick={() => {
                                            isUpdateSalleBtnClicked(salle.id);
                                            // console.log(document.querySelector("option[value='55']"));
                                            // document.querySelector("option[value='55']").selected=true;
                                        }
                        } 
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
                                title:'??tes-vous s??r de vouloir supprimer cette salle ?',
                                subtitle:'vous ne pouvez plus r??cup??rer cet ??l??ment',
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
                    <form className="my-form"  onSubmit={ !showUpdate.isClicked ? handleCreate : handleUpdate}>
                        <div className="mb-4">
                            <legend>{ !showUpdate.isClicked ? "Ajouter une salle" : "Modifier la salle"}</legend>
                            <hr />
                
                            <label htmlFor="numeroSalle" className="form-label">Num??ro : </label>
                            
                            <input type="text" /*defaultValue={showUpdate.isClicked ? findNumeroSalleById(showUpdate.id) : ""}*/ value={valueNumero}  onChange={handleNumeroChange} name="numero" className="form-control" id="numeroSalle" required  />
                            
                            <label htmlFor="descriptionSalle" className="form-label">Description : </label>
                            <input type="text" name="description" /*defaultValue={showUpdate.isClicked ? findDescriptionSalleById(showUpdate.id) : ""*/ value={valueDescription} onChange={handleSelectDescription} className="form-control" id="descriptionSalle" required />
                            <label htmlFor="selectCategorie" className="form-label">Cat??gorie:</label>
                                
                            <select value={valueCategorie} onChange={handleSelectCategorieChange} className="form-control" id="selectCategorie" required>
                                
                                <option key="0" value="">Choisissez la cat??gorie de la salle</option>
                                        {
                                            listeCategories.map((categorie) =>
                                                // console.log("Cat??gorie.id:" + categorie.id + "//" + "la fonction:" + findIdCategorieById(showUpdate.id) ) : console.log("no one clicked"),
                                                // showUpdate.isClicked ? categorie.id == findIdCategorieById(showUpdate.id)? 
                                                // console.log("Cat??gorie.id:" + categorie.id
                                                //              + "//" + "la fonction:" + findIdCategorieById(showUpdate.id)
                                                //              + "le type est:" + findTypeCategorieById(findIdCategorieById(showUpdate.id)) )
                                                            //   : console.log("la condition n'est pas pass??e:" + categorie.id)
                                                //  <option key={categorie.id} value={categorie.id} selected>{findTypeCategorieById(findIdCategorieById(showUpdate.id))}</option>:
                                                <option key={categorie.id} value={categorie.id}>{categorie.type}</option>
                                            )

                                        }
                            </select>
                            {console.log(document.querySelector("option[value='55']"))}
                            {/* {document.querySelector("option[value='55']").selected=true} */}
                            
                            
                        </div>
                        { !showUpdate.isClicked ? <button type="submit" className="btn btn-primary"  >Cr??er</button> : 
                            <div>
                                <button type="submit" className="btn btn-primary">Modifier</button>
                                <br />
                                <span 
                                    className="btn btn-outline-secondary btn-sm mt-3" 
                                    onClick={handleAnnuler}
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
                                <th>Num??ro</th>
                                <th>Cat??gorie</th>
                                <th>Description</th>
                                <th>Cr??e le</th>
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



/**<input 
          type="text" 
          className="form-control" 
                                        id="inputNumero"
                                        value={}
                                        onChange={handleNumeroChange}
                                        required
                                        //placeholder="Entrer la dur??e" 
                                    /> */

