import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from  "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; //route folder: routes for every feature
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";



// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url); //to grab file url
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets"); 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    },
  });
  const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);  // upload.single("picture")-> middleware, upload picture locally in public/asset folder
                                                                // after middleware function done, register hass the logic of saving user to db, & relevant func<- activates when it hits the endpoint 

app.post("/posts", verifyToken, upload.single("picture"), createPost);  //allowing user to upload pics, hence jwt verify to make sure he's logged in

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/*  STATIC FILES*/
app.use(express.static(path.join(__dirname, "../client/build")));
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME ONLY */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));