const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();



app.use(express.json())

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");



app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);


async function dbConnection(){
    await mongoose.connect(process.env.Mongoo_URL);
    console.log("Coonected to DB")
}

dbConnection();

app.listen(3000);