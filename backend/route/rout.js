const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controller/registration-controller');
const upload = require('../middleware/upload');
const { getStatusController } = require('../controller/status-controller');
const adminController = require("../controller/admin-controller");
const auth = require("../middleware/auth");
const adminDataController = require("../controller/admin-data-controller");
const configController = require("../controller/config-controller");


router.get('/', (req, res) => {
    res.send("Hello World");
});

//User
router.get('/status/:regId', getStatusController);
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
    auth,
    adminDataController.getAllRegistrationsController
);

router.put(
    "/admin/registrations/:id/paymentStatus",
    auth,
    adminDataController.updateStatusController
);

router.delete(
    "/admin/registrations/:id",
    auth,
    adminDataController.deleteRegistrationController
);

router.get(
    "/admin/registrations/stats",
    auth,
    adminDataController.getStatsController
);

router.put(
    "/admin/config/limit",
    auth,
    configController.updateGroupLimitController
);

router.get(
    "/admin/config/global",
    auth,
    configController.getGlobalConfigController
);

router.put(
    "/admin/config/update/global",
    auth,
    configController.updateGlobalConfigController
);

module.exports = router;