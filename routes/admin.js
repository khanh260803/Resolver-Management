const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwt');
const checkRole = require('../middleware/authRole');
const adminController = require('../controller/admin');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Admin routes with role-based access control
router.get('/user-management', checkRole(['Admin','Company-account']),adminController.getUserManagement);
router.post('/user-management', checkRole(['Admin']), adminController.postUserManagement);
router.delete('/user-management/delete/:id', checkRole(['Admin']), adminController.deleteUser);

// Other admin routes
router.get('/user-management/add-user', checkRole(['Admin']), adminController.displayAddUser);
router.post('/user-management/add-user', checkRole(['Admin']), adminController.addUser);

router.get('/user-management/edit-user/:id', checkRole(['Admin']), adminController.displayEditUser);
router.post('/user-management/edit-user/:id', checkRole(['Admin']), adminController.editUser);

router.get('/company-management', checkRole(['Admin']), adminController.renderCompany);
router.get('/topic-management', checkRole(['Admin']), adminController.renderTopic);
router.get('/tag-management', checkRole(['Admin']), adminController.renderTag);

router.get('/company-management/add-company', checkRole(['Admin']), adminController.displayAddCompany);
router.post('/company-management/add-company', checkRole(['Admin']), adminController.addCompany);
//edit company
router.get('/company-management/edit-company/:id', checkRole(['Admin']), adminController.displayEditCompany);
router.post('/company-management/edit-company/:id', checkRole(['Admin']), adminController.editCompany);

router.get('/topic-management/add-topic', checkRole(['Admin']), adminController.displayAddTopic);
router.post('/topic-management/add-topic',checkRole(['Admin']),adminController.addTopic);
//add tag


router.get('/tag-management/add-tag', checkRole(['Admin']), adminController.displayAddTag);
router.post('/tag-management/add-tag', checkRole(['Admin']), adminController.addTag);

router.get('/post-management', checkRole(['Admin']), adminController.renderPost);
router.get('/post-management/add-post', checkRole(['Admin']), adminController.displayAddPost);
router.post('/post-management/add-post', checkRole(['Admin']), adminController.addPost);

router.get('/dashboard-management', adminController.renderDashboard);


module.exports = router;
