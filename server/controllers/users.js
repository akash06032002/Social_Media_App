import User from "../models/User.js";

/* READ */

//req.params is an object that contains the route parameters extracted from the URL.
// When defining a route with a parameter placeholder, such as /:id, 
//any value provided for that parameter in the actual URL will be accessible through req.params.

//eg route defn: router.get("/:id", getUser);

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;  
    const user = await User.findById(id); //find user from db
    res.status(200).json(user); //send that to frontend to show user
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => { //This function is responsible for retrieving a user's friends.
  try {
    const { id } = req.params;
    const user = await User.findById(id); //find user whose friends are needed to be fetched

    const friends = await Promise.all(  //user.friends represents an array of friend IDs associated with the user.
      user.friends.map((id) => User.findById(id)) //User.findById() to fetch the corresponding friend document from the db.
    ); 
    //formattedFriends is a new array created by mapping over the friends array. 
    //For each friend document, it extracts specific properties such as _id, firstName, etc and creates a new object with these properties.                                           
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);  //formatted friends sent to frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => { 
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {    // checks if the friendId is already present in the user.friends array
      user.friends = user.friends.filter((id) => id !== friendId); //it removes the friendId from user.friends 
      friend.friends = friend.friends.filter((id) => id !== id);  ////and id from friend.friends. This effectively removes the friendship.
    } else {//If the friendId is not present in user.friends
      user.friends.push(friendId); //it adds friendId to user.friends
      friend.friends.push(id); //id to friend.friends , this makes friendship
    }
    await user.save();  //save the updated user 
    await friend.save();//and friend documents back to db after add/remove friendship.

    const friends = await Promise.all(    //Promise.all to make multiple api calls to the db
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(  
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    ); //sending updated formatted friends  to frontend

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};