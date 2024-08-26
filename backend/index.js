require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB  = require("./db/connectDB");

const authRoutes = require("./routes/auth.route");

const app = express();
app.use(cookieParser()); // allow us to parse imcoming request with cookies : req.cookies
const PORT = process.env.PORT || 5000;
//const __dirname = path.resolve();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true}));

console.log("JWT_SECRET : ",process.env.JWT_SECRET);

app.use(express.json()); // allow us to parse imcoming request with JSON payloads : req.body

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    })
}
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port " + PORT);
});