import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { //req<- we get from frontend; res<- what we going to send back to the body
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
          } = req.body; //we grab this from req.body -> req.body is obj with these parameters, and we just get hold of the parameters
        
        //   bcrypt is a library used for hashing passwords.
        //   jwt is a library used for generating JSON Web Tokens.

        const salt = await bcrypt.genSalt(); //bcrypt.genSalt() generates a salt, which is a random string used for additional security in password hashing.
        const passwordHash = await bcrypt.hash(password, salt); //bcrypt.hash() takes the plain password and the generated salt to hash the password.
        
        // creates a new instance of the User model 
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
          });
          const savedUser = await newUser.save(); //save() method on the newUser instance to save it to the database.
          //The save() method is an asynchronous operation, so await is used to wait for the operation to complete before proceeding.

          res.status(201).json(savedUser); //sending user json obj to frontend

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email }); //finding user with req.body.email
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password); //pass sent and pass in db is same, same salt used
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //sign jwt with user id
      delete user.password; //so that pass is not sent back to frontend
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };