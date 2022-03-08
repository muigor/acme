// #region UTILS

// The base URL of the application
const BASE_URL = "http://localhost/api" // * TO DEBUG.

// Build an URL depending of the path given, with, as base, the const URL above
const URL = (pPath) => BASE_URL + pPath

// HEADER for common request, that aren't involving an user
const BODY_JSON_HEADER = {"content-type": "application/json"}

// If an user is involved, pass his token, and build header
// This option will not be used for now because we dont have any authentification in our backend api. I added it for future members
const TOKEN_HEADER = (token) => { return {"WWW-Authenticate": token}}


// Perform a PUT request
const put = (pUrl, pBody, pHeaders) => fetch(pUrl, { method: 'PUT', body: JSON.stringify(pBody), headers:pHeaders})
// Perform a POST request
const post = (pUrl, pBody, pHeaders) => fetch(pUrl, { method: 'POST', body: JSON.stringify(pBody), headers:pHeaders})
// Perform a DELETE request
const remove = (pUrl, pBody, pHeaders) => fetch(pUrl, { method: 'DELETE', headers:pHeaders})
// Perform a GET request
const get = (pUrl) => fetch(pUrl, { headers: BODY_JSON_HEADER })

// #endregion


// #region materiels

/**
 * Get all materials available on the api
 */
export const materialsGetAll = () => get(URL("/materiel"))

/**
 * Get a specific material available on the api
 * @param {number} pk The id of the material to retrieve
 */
export const materialsGetOne = (pk) => get(URL(`/materiel/${pk}/`))

/**
 * Create a new material on the api
 * @param {string} pNom  The material name
 * @param {number} pNum the number of the room 
 */
export const createMaterial = (pNom,pNum) => post(URL("/materiel/"), { "nom": pNom, "salle" : pNum }, {...BODY_JSON_HEADER})

/**
 * Update an existing material on the api
 * @param {number} pk The id of the material to update
 * @param {string} pNom The new name
 * @param {number} pNum the number of the room 
 */
export const updateMaterial = (pk, pNom, pNum) => put(URL(`/materiel/${pk}/`), { "nom": pNom, "salle":pNum }, {...BODY_JSON_HEADER})

/**
 * Delete a material
 * @param {number} pk The id of the material to delete
 */
//export const deleteMaterial = (pk) => remove(URL("/materiel/"+{pk}+"/"), {...BODY_JSON_HEADER})
export const deleteMaterial = (pk) => remove(URL(`/materiel/${pk}/`), {...BODY_JSON_HEADER})

// #endregion


// #region catégories

/**
 * Get all categories available on the api
 */
export const categoriesGetAll = () => get(URL("/categorie"))

/**
 * Get a specific category available on the api
 * @param {number} pk The id of the category to retrieve
 */
export const categoriesGetOne = (pk) => get(URL(`/categorie/${pk}/`))

/**
 * Create a new category on the api
 * @param {string} type  The category name
 */
export const createCategories = (pType) => post(URL("/categorie/"), { "type": pType }, {...BODY_JSON_HEADER})

/**
 * Update an existing category on the api
 * @param {number} pk The id of the category to update
 * @param {string} pType The new name
 */
export const updateCategories = (pk, pType) => put(URL(`/categorie/${pk}/`), { "type": pType }, {...BODY_JSON_HEADER})

/**
 * Delete a category
 * @param {number} pk The id of the category to delete
 */
export const deleteCategories = (pk) => remove(URL(`/categorie/${pk}/`), {...BODY_JSON_HEADER})

// #endregion



// #region Salle

/**
 * Get all rooms available on the api
 */
export const salleGetAll = () => get(URL("/salle"))

/**
 * Get a specific room available on the api
 * @param {number} pk The id of the room to retrieve
 */
export const salleGetOne = (pk) => get(URL(`/salle/${pk}/`))

/**
 * Create a new room on the api
 * @param {number} pNum The number of the room
 * @param {string} pDesc The room description
 * @param {number} pCategory The id of the room category
 * 
 */
export const createSalle = (pNum,pDesc, pCategory) => post(URL("/salle/"), { "numero": pNum, "description": pDesc, "categorie": pCategory }, {...BODY_JSON_HEADER})

/**
 * Update an existing room on the api
 * @param {number} pk The id of the room 
 * @param {number} pNum The new number of the room
 * @param {string} pDesc The new room description
 * @param {number} pCategory The id of the room category
 * 
 */
export const updateSalle = (pk, pNum, pDesc, pCategory) => put(URL(`/salle/${pk}/`), { "numero": pNum, "description": pDesc, "categorie": pCategory}, {...BODY_JSON_HEADER})

/**
 * Delete a room
 * @param {number} pk The id of the room to delete
 */
export const deleteSalle = (pk) => remove(URL(`/salle/${pk}/`), {...BODY_JSON_HEADER})

// #endregion


// #region Client

/**
 * Get all Client available on the api
 */
export const clientGetAll = () => get(URL("/client"))

/**
 * Get a specific Client from the api
 * @param {number} pk The id of the Client to retrieve
 */
export const clientGetOne = (pk) => get(URL(`/client/${pk}/`))

/**
 * Create a new Client on the api
 * @param {string} pNom  The client name
 */
export const createClient = (pNom) => post(URL("/client/"), { "nom": pNom }, {...BODY_JSON_HEADER})

/**
 * Update an existing Client on the api
 * @param {number} pk The id of the client to update
 * @param {string} pNom The new name
 */
export const updateClient = (pk, pNom) => put(URL(`/client/${pk}/`), { "nom": pNom }, {...BODY_JSON_HEADER})

/**
 * Delete a Client
 * @param {number} pk The id of the client to delete
 */
export const deleteClient = (pk) => remove(URL(`/client/${pk}/`), {...BODY_JSON_HEADER})

// #endregion



// #region Réservation

/**
 * Get all Reservations available on the api
 */
export const reservationGetAll = () => get(URL("/reservation"))

/**
 * Get a specific Reservation from the api
 * @param {number} pk The id of the reservation to retrieve
 */
export const reservationGetOne = (pk) => get(URL(`/reservation/${pk}/`))

/**
 * Create a new Reservation on the api
 * @param {date} pDate  The Reservation Start date
 * @param {number} pDuree The Reservation duration
 * @param {string} pUnite The unity of the duration
 * @param {number} pSalle The id of the room to be reserved
 * @param {number} pClient The id of the client making the reservation
 */
export const createReservation = (pDate, pDuree, pSalle, pClient,pUnite) => post(URL("/reservation/"), { "dateDebut": pDate, "duree": pDuree, "Salle": pSalle, "client": pClient,"unite" : pUnite}, {...BODY_JSON_HEADER})

/**
 * Update an existing Client on the api
 * @param {number} pk The id of the Reservation to update
 * @param {date}   pDate  The Reservation Start date
 * @param {number} pDuree The Reservation duration
 * @param {string} pUnite The unity of the duration
 * @param {number} pSalle The id of the room to be reserved
 * @param {number} pClient The id of the client making the reservation
 */
export const updateReservation = (pk, pDate, pDuree, pUnite, pSalle, pClient) => put(URL(`/reservation/${pk}/`), { "dateDebut": pDate, "duree": pDuree,"unite" : pUnite, "Salle": pSalle, "client": pClient}, {...BODY_JSON_HEADER})

/**
 * Delete a Reservation
 * @param {number} pk The id of the reservation to delete
 */
export const deleteReservation = (pk) => remove(URL(`/reservation/${pk}/`), {...BODY_JSON_HEADER})

// #endregion