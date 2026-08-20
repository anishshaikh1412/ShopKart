const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ayushprj12_db_user:Lsi2BwPvCGh5EwKN@productdb.gcfweo1.mongodb.net/ecommerce_db?appName=ProductDB"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
