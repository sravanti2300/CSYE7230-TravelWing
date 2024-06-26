const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const User = require('../models/userModel');

const createUser = async ( email, password, fname, lname) => {


  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({

    email,
    password: hashedPassword,
    fname,
    lname,
  });
  
    await newUser.save();
    return {newUser};
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
 
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  
  return {user};
};

const googleSignIn = async (user) => {
  // Hash a dummy password
  const dummyPassword = await bcrypt.hash('googleSignUpDummyPassword', 10);
  
  const newUser = new User({
    email: user.email,
    fname: user.displayName,
    lname: user.displayName,
    password: dummyPassword,
    provider: 'google',
    uid: user.uid
  });
  const newUserString = JSON.stringify(newUser);


  await newUser.save();
  return { newUser };
};

const facebookSignIn = async (user) => {
  const newUser = new User({
    email: user.email,
    fname: user.displayName,
    lname: user.displayName,
    password: 'do not need password in mongoDB for fb sign in.',
    provider: 'fb'
  });

  await newUser.save();
  return { newUser };
}

const getUserDetailsById = async (email) => {
  try {
    console.log("Inside getUserDetailsById services");
    const user = await User.findOne({ email: email });
    console.log("Hello user in getUser ", user);
    if (!user) {
      throw new Error('User not found');
    }
    return user;  // Return user directly instead of using res.json
  } catch (error) {
    throw new Error('Server error', error.message);  // Throw an error to be handled by the caller
  }
}


module.exports = {
  createUser, loginUser, googleSignIn, facebookSignIn, getUserDetailsById
};
