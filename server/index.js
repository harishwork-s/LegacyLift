const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analysis',      require('./routes/analysis'));
app.use('/api/dashboard',     require('./routes/dashboard'));
app.use('/api/modernization', require('./routes/modernization'));
app.use('/api/comparison',    require('./routes/comparison'));
app.use('/api/validation',    require('./routes/validation'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LegacyLift API running on http://localhost:${PORT}`));
