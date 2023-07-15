import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
// Route to get user details by ID
router.get("/:id", verifyToken, getUser); //route will we users/<some_id>
                                         //:id -> if frontend is sending user id over hre, we can grab this id and call our db with that particular id {query string} 
// Route to get user's friends by ID
router.get("/:id/friends", verifyToken, getUserFriends);


/* UPDATE */
// Route to add or remove a friend for a user
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
