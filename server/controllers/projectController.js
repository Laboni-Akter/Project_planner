const firebase = require('../db');
const Project = require('../models/project');
const firestore = firebase.firestore();


const addProject = async (req, res, next) => {
    try {
        const uid = req.query.uid;
        const data = req.body;
        data.createdby = uid;
        const result = await firestore.collection('projects').add(data);
        res.send(result.id);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAllProjects = async (req, res, next) => {
    try {
        const uid = req.query.uid;
        const projects = await firestore.collection('projects').where("createdby", "==", uid);
        const data = await projects.get();
        const projectsArray = [];
        if(data.empty) {
            res.send([]);
        }else {
            data.forEach(doc => {
                const project = new Project(
                    doc.id,
                    doc.data().name,
                    doc.data().manager
                );
                projectsArray.push(project);
            });
            res.send(projectsArray);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getProject = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await firestore.collection('projects').doc(id);
        const data = await project.get();
        if(!data.exists) {
            res.status(404).send('Project with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateProject = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const project =  await firestore.collection('projects').doc(id);
        await project.update(data);
        res.send('Project record updated successfuly');        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteProject = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('projects').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    addProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
}