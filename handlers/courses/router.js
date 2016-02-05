var Router = require('koa-router');
var mustBeAuthenticated = require('auth').mustBeAuthenticated;
var mustBeParticipantOrTeacher = require('./lib/mustBeParticipantOrTeacher');
var mustBeParticipant = require('./lib/mustBeParticipant');
var mustBeTeacher = require('./lib/mustBeTeacher');
var mustBeTeacherOrAdmin = require('./lib/mustBeTeacherOrAdmin');
var mustBeAdmin = require('auth').mustBeAdmin;
var router = module.exports = new Router();

router.param('userById', require('users').routeUserById);
router.param('groupBySlug', require('./lib/routeGroupBySlug'));

router.get('/register-participants/:groupBySlug', mustBeAdmin, require('./controller/registerParticipants').get);


router.get('/', require('./controller/frontpage').get);

router.get('/feedback-fetch', require('./controller/courseFeedbackFetch').get);

router.get('/:course', require('./controller/course').get);

// same controller for new signups & existing orders
router.get('/groups/:groupBySlug/signup', require('./controller/signup').get);
router.get('/orders/:orderNumber(\\d+)', require('./controller/signup').get);

router.get('/admin/orders/:orderNumber(\\d+)', mustBeAuthenticated, require('./controller/adminOrder').get);
router.post('/admin/orders/:orderNumber(\\d+)', mustBeAuthenticated, require('./controller/adminOrder').post);

router.get('/groups/:groupBySlug/info', mustBeParticipantOrTeacher, require('./controller/groupInfo').get);
router.get('/groups/:groupBySlug/materials', mustBeParticipantOrTeacher, require('./controller/groupMaterials').get);
router.get('/groups/:groupBySlug/participants-info', mustBeTeacherOrAdmin, require('./controller/participantsInfo').get);
router.post('/groups/:groupBySlug/materials', mustBeTeacher, require('./controller/groupMaterials').post);
router.del('/groups/:groupBySlug/materials', mustBeTeacher, require('./controller/groupMaterials').del);

router.get('/groups/:groupBySlug/logs/:logName', mustBeParticipantOrTeacher, require('./controller/groupLogs').get);

router.get('/groups/:groupBySlug/ical', require('./controller/groupIcal').get);



// not groups/:groupBySlug/* url,
// because the prefix /course/download must be constant for nginx to proxy *.zip to node
router.get('/download/:groupBySlug/:filename', mustBeParticipantOrTeacher, require('./controller/groupMaterialsDownload').get);

router.all('/groups/:groupBySlug/feedback', require('./controller/groupFeedbackEdit').all);
router.all('/feedback/edit/:feedbackNumber(\\d+)', require('./controller/groupFeedbackEdit').all);

router.get('/:course/feedback', require('./controller/courseFeedback').get);

router.patch('/feedback/comment', mustBeAuthenticated, require('./controller/groupFeedbackComment').patch);
router.get('/feedback/:feedbackNumber(\\d+)', require('./controller/groupFeedbackShow').get);

router.patch('/participants', require('./controller/participants').patch);
router.get('/download/participant/:participantId/certificate.jpg', mustBeAuthenticated, require('./controller/participantCertificateDownload').get);


router.all('/invite/:inviteToken?', require('./controller/invite').all);

// for profile
router.get('/profile/:userById', mustBeAuthenticated, require('./controller/coursesByUser').get);

