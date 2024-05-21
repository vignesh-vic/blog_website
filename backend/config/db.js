const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.mongodb)
            .then(() => console.log("DB Connected"))
            .catch((err) => console.log(err));
    } catch (error) {

    }
}
module.exports = connectDB;