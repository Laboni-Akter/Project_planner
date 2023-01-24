const firebase = require('../db');
const Resource = require('../models/resource');
const firestore = firebase.firestore();


const addResource = async (req, res, next) => {
    try {
        const uid = req.query.uid;
        const data = req.body;
        data.createdby = uid;
        const result = await firestore.collection('resources').add(data);
        res.send(result.id);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAllResources = async (req, res, next) => {
    try {
        const uid = req.query.uid;
        const resources = await firestore.collection('resources').where("createdby", "==", uid);;
        const data = await resources.get();
        const resourcesArray = [];
        if(data.empty) {
            res.send([]);
        }else {
            data.forEach(doc => {
                const resource = new Resource(
                    doc.id,
                    doc.data().name,
                    doc.data().title
                );
                resourcesArray.push(resource);
            });
            res.send(resourcesArray);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getResource = async (req, res, next) => {
    try {
        const id = req.params.id;
        const resource = await firestore.collection('resources').doc(id);
        const data = await resource.get();
        if(!data.exists) {
            res.status(404).send('Resource with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateResource = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const resource =  await firestore.collection('resources').doc(id);
        await resource.update(data);
        res.send('Resource record updated successfuly');        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteResource = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('resources').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    addResource,
    getAllResources,
    getResource,
    updateResource,
    deleteResource
}