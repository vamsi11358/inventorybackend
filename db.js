const mongoose=require("mongoose")

require("dotenv").config()

const connection=mongoose.connect(process.env.db)

console.log(connection,'connection');

module.exports={connection}