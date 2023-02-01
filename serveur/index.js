const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//import route
const productRoute = require("./src/routes/product");

//Config App
const app = express();

//connect to mongoDB
mongoose.set("strictQuery", true);
mongoose
    .connect("mongodb://127.0.0.1/scrapped")
    .then(() => console.log("connected sucssufully !!"))
    .catch((err) => console.log(err));

//Middleware
app.use(cors());
app.use(express.json());

app.use("/", productRoute);

//start server
const port = 8000;
app.listen(port, () => console.log(`app is running on port ${port}`));