const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controller/registration-controller');
const upload = require('../middleware/upload');
const { getStatusController } = require('../controller/status-controller');
const adminController = require("../controller/admin-controller");
const { authMiddleware, checkRole } = require("../middleware/auth");
const adminDataController = require("../controller/admin-data-controller");
const configController = require("../controller/config-controller");
const judgeController = require("../controller/judge-controller");
const lyricController = require("../controller/lyric-controller");


router.get('/', (req, res) => {
    res.send("Hello World");
});

//User
router.get('/status/:regId', getStatusController);
const { submitFinalNaatController } = require('../controller/status-controller');
router.put('/status/:regId/naat', submitFinalNaatController);
router.post(
    '/register',
    (req, res, next) => {
        upload.fields([
            { name: 'photo', maxCount: 1 },
            { name: 'proof', maxCount: 1 },
            { name: 'transactionProof', maxCount: 1 }
        ])(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    },
    controller.createRegistrationController
);

router.get('/config/availability', configController.getGroupAvailabilityController);

// Admin Auth
router.post("/admin/register", adminController.registerAdminController);
router.post("/admin/login", adminController.loginAdminController);

// Admin Data
router.get(
    "/admin/registrations",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.getAllRegistrationsController
);

router.put(
    "/admin/registrations/:id/paymentStatus",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.updateStatusController
);

router.put(
    "/admin/registrations/:id/roundSelection",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.toggleRoundSelectionController
);

router.put(
    "/admin/registrations/:id/rejectRound1",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.rejectRound1Controller
);

router.delete(
    "/admin/registrations/:id",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.deleteRegistrationController
);

router.delete(
    "/admin/registrations/:id/scores/:judgeId",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.deleteRegistrationScoreController
);

router.get(
    "/admin/registrations/stats",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    adminDataController.getStatsController
);

// Judge Management (Admin Only)
router.post(
    "/admin/judges",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    judgeController.createJudgeController
);

router.get(
    "/admin/judges",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    judgeController.getAllJudgesController
);

router.put(
    "/admin/judges/:id",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    judgeController.updateJudgeController
);

router.delete(
    "/admin/judges/:id",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    judgeController.deleteJudgeController
);

// Judging Routes
router.get(
    "/judge/registrations",
    authMiddleware,
    checkRole(["judge"]),
    judgeController.getJudgingRegistrationsController
);

router.post(
    "/judge/score",
    authMiddleware,
    checkRole(["judge"]),
    judgeController.submitScoreController
);

router.put(
    "/admin/config/limit",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    configController.updateGroupLimitController
);

router.get(
    "/admin/config/global",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    configController.getGlobalConfigController
);

router.put(
    "/admin/config/update/global",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    configController.updateGlobalConfigController
);

// Lyrics Routes
router.post(
    "/admin/lyrics",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    lyricController.addLyricController
);

router.get(
    "/admin/lyrics",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    lyricController.getLyricsController
);

router.delete(
    "/admin/lyrics/:id",
    authMiddleware,
    checkRole(["superadmin", "admin"]),
    lyricController.deleteLyricController
);

module.exports = router;