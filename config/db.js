const { connect } = require('mongoose');
require('dotenv').config({ path: '.env' });
const c = console.log;


(async () => {
    try {
        const db = await connect(process.env.DB_MONGO);
        c(`My Database is: ${db.connection.name}`);
    } catch (error) {
        c(`On Error :'(`);
        c(error);
        process.exit();
    }
})();
