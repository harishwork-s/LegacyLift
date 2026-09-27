const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/modernization-plan.json'), 'utf8'));
  res.json(data);
});

module.exports = router;
