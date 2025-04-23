const mongoose = require('mongoose');
const connectToDB  = async()=> {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo db connected suceessfully");

    }catch(e){
        console.error('mongodb coonection failed');
        process.exit(1)
    }
}
module.exports = connectToDB;