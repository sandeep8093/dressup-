const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Token = require('../model/Token');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt');



exports.signup = async (req, res) => {
  let { email, password,username  } = req.body;
  const newUser = new User({
    email: email,
    username:username,
    password: bcrypt.hashSync(password, 10),
  });

  try {
    const savedUser = await newUser.save();
    console.log("new")
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.signin = async (req, res) => {
  // console.log(req.body.password);
  
  await User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {

        const payload = {
          id: user._id,
          email: user.email,
          username:user.username
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '2h',
        });

        return res.status(200).json({
          token,
          payload,
        });
      } else {
        return res.status(400).json({ message: 'wrong password' });
      }
    } else {
      return res.status(400).json({ message: 'user not found' });
    }
  });
};

exports.signout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'signout successfully' });
};

exports.forgotpassword = async (req, res) => {
  await User.findOne({ email: req.body.email, verified: true }).exec(
    async (error, user) => {
      if (error) return res.json({ message: 'something wrong' });
      if (user) {
        const { email } = req.body;
        let otp = Math.floor(Math.random() * 1000000);
        console.log(otp);
        otp = otp.toString();
        const token = Token.findOne({ email: email });
        if (token) await token.deleteOne();
        const subject = 'forget password otp request';
        const isSent = sendEmail(email, subject, otp);
        if (!isSent) {
          otp = bcrypt.hashSync(otp, 10);
          await new Token({
            email,
            otp,
          }).save();
          return res.status(200).json({ message: 'email is sent' });
        } else
          return res
            .status(400)
            .json({ message: 'something went wrong!! try again' });
      } else {
        res.json({ message: 'user not found' });
      }
    }
  );
};

exports.createpassword = async (req, res) => {
  let dbToken = await Token.findOne({ email: req.body.email });
  console.log(dbToken)
  if (bcrypt.compareSync(req.body.otp, dbToken.otp)) {
    let user = await User.findOne({ email: req.body.email });
    user.password = bcrypt.hashSync(req.body.password, 10);

    const payload = {
      id: user._id,
      email: user.email,
    };

    await user.save();
    await dbToken.delete();

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(200).json({
      token,
      payload,
    });
  } else {
    res.status(400).json({ message: 'wrong otp' });
  }
  const { id, token } = req.query;

  await Token.findOne({ email: email }).exec(async (error, data) => {
    if (error) return res.json({ message: 'something wrong' });
    if (token) {
      const isValid = data.authenticate(token);
      if (isValid) {
        const password = bcrypt.hashSync(req.body.password, 10);
        const user = await User.findByIdAndUpdate(
          {
            _id: id,
          },
          { $set: { hash_password: password } }
        );
        if (user)
          return res.json({ message: 'password changed successfully!!!' });
      } else {
        return res.json({ message: 'expired link' });
      }
    }
  });
};

exports.activateAccount = async function (req, res) {
  console.log(req.body.email);
  console.log(req.body.password);
  let user = await User.findOne({ email: req.body.email });
  console.log(user.email);
  console.log(user.password);
  if (!req.body.password) {
    return res.status(400).json({ message: 'password not entered' });
  }
  if (bcrypt.compareSync(req.body.password, user.password)) {
    user.accountActivated = true;
    user.deactivationDate = 'N/A';
    await user.save();
    return res.status(200).json({ message: 'account activated' });
  } else {
    res.status(400).json({ message: 'wrong password' });
  }
};



exports.changePassword = async function (req, res) {
  let currentUser = req.user;

  let user = await User.findOne({ _id: currentUser.id });

  if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
    user.password = bcrypt.hashSync(req.body.newPassword, 10);
    await user.save(function (err, doc) {
      if (err) res.status(500).json(err);
      else res.status(200).json({ message: 'password changed successfully' });
    });
  } else {
    res.status(400).json({ message: 'wrong password' });
  }
};

