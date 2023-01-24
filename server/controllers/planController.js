const firebase = require('../db');
const Plan = require('../models/plan');
const firestore = firebase.firestore();


const addPlan = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await firestore.collection('plans').add(data);
        res.send(result.id);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAllPlans = async (req, res, next) => {
    try {
        const projectID = req.query.projectID;
        const plans = await firestore.collection('plans').where("projectID", "==", projectID);
        const data = await plans.get();
        const plansArray = [];
        if(data.empty) {
            res.send([]);
        }else {
            data.forEach(doc => {
                const plan = new Plan(
                    doc.id,
                    doc.data().title,
                    projectID,
                    doc.data().resourceID,
                    doc.data().eta,
                    doc.data().index
                );
                plansArray.push(plan);
            });
            res.send(plansArray);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getPlan = async (req, res, next) => {
    try {
        const id = req.params.id;
        const plan = await firestore.collection('plans').doc(id);
        const data = await plan.get();
        if(!data.exists) {
            res.status(404).send('Plan with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updatePlan = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const plan =  await firestore.collection('plans').doc(id);
        await plan.update(data);
        res.send('Plan record updated successfuly');        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deletePlan = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('plans').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    addPlan,
    getAllPlans,
    getPlan,
    updatePlan,
    deletePlan
}