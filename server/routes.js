const express = require('express');
const project = require('./controllers/projectController');
const resource = require('./controllers/resourceController');
const plan = require('./controllers/planController');
const auth = require('./controllers/authController');

const router = express.Router();

router.post('/projects', project.addProject);
router.get('/projects', project.getAllProjects);
router.get('/projects/:id', project.getProject);
router.put('/projects/:id', project.updateProject);
router.delete('/projects/:id', project.deleteProject);

router.post('/resources', resource.addResource);
router.get('/resources', resource.getAllResources);
router.get('/resources/:id', resource.getResource);
router.put('/resources/:id', resource.updateResource);
router.delete('/resources/:id', resource.deleteResource);

router.post('/plans', plan.addPlan);
router.get('/plans', plan.getAllPlans);
router.get('/plans/:id', plan.getPlan);
router.put('/plans/:id', plan.updatePlan);
router.delete('/plans/:id', plan.deletePlan);

router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/forgotpassword', auth.forgotpassword);

module.exports = router