const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./Routes/Auth");
const userRoute = require("./Routes/userApi");
const likeRoutes = require("./Routes/Like");
const postRoute = require("./Routes/PostApi");
const categoryRoute = require("./Routes/CatagoryApi");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(cors());
mongoose
  .connect(process.env.MONGO_URI, {
    
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/likes", likeRoutes); 
app.listen(process.env.PORT, () => {
  console.log("Backend is running." + process.env.PORT);
});