const express = require('express');
const importExportController = require('../controllers/importExport')
const router = express.Router();

router.get('/export',importExportController.exportData)

router.post('/import',importExportController.importDataCSV)



module.exports = router;
