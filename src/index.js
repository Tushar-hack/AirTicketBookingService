const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {PORT} = require('./config/serverConfig');
const v1ApiRoutes = require('./routes/index');
const db = require('./models/index');

const setUpAndStartServer = () => {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use('/api', v1ApiRoutes);

    app.listen(PORT, () =>{

        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }

        console.log(`Server started on port ${PORT}`);
    }); 
}

setUpAndStartServer();