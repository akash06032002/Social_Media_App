import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;  //frontend sent data deconstructed
    const user = await User.findById(userId);  //grabbing user info via id from db
    const newPost = new Post({  //creating instance of post model
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); //saving post to mongo db

    const post = await Post.find(); //grab all the posts from db
    res.status(201).json(post);  //return to frontend
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); //all the posts of all users
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//router.get("/:userId/posts", verifyToken, getUserPosts); from posts in routes
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); //gt postid of this user
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

//router.patch("/:id/like", verifyToken, likePost);
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;  //from query string, id of the post
    const { userId } = req.body; //userid from frontend
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);  //check in the likes(map) if userid exists

    if (isLiked) { //if user exists in likes(map)-> post already liked
      post.likes.delete(userId);  //unlike
    } else {
      post.likes.set(userId, true); //like, include in the likes(map)
    }

    //update specific post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },  //list of likes we updated
      { new: true }
    );

    res.status(200).json(updatedPost); //send updated post to the frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};