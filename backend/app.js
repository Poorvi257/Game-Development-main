const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', require('./routes/v1/userRoutes'));

const PORT = 8000;
app.listen(PORT, () => {
    console.log("Server is running at :", PORT);
});
