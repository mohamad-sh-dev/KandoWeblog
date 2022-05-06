const mongoose = require("mongoose");
const debug = require("debug")("weblog-project")

const Conection = async ()=>{
try {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useFindAndModify:true,
        useUnifiedTopology:true
    })
    debug(`Mongodb connected:${conn.connection.host}`);
} catch (err) {
    console.log(err);
    process.exit(1)
}

}

module.exports = Conection;
