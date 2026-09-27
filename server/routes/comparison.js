const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const before = fs.readFileSync(path.join(__dirname, '../fixtures/legacy/CustomerOrderProcessor.java'), 'utf8');
  const after  = fs.readFileSync(path.join(__dirname, '../fixtures/modernized/CustomerOrderService.java'), 'utf8') +
                 '\n\n// ─── Repository Layer ───────────────────────────────────────────────────────\n\n' +
                 fs.readFileSync(path.join(__dirname, '../fixtures/modernized/CustomerOrderRepository.java'), 'utf8');
  res.json({ before, after });
});

module.exports = router;
