require("dotenv").config();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const cron = require('node-cron');
// const { request } = require("express");
// const { json } = require("body-parser");
// const jwt = require("jsonwebtoken");


exports.Register = async (req, res) => {
  const { name,email } = req.body;
  await User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).send('That user already exisits!');
  } else {
      // Insert the new user if they do not exist yet
      user = new User({
          name:name,
          email: email
      });
      await user.save();
      res.status(200).send(user);
  }
  });
};


exports.Login = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const { email } = req.body;
  await User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      console.log(user);
      return res.status(200).send(user);
  } else {
       return res.status(400).send('The user doesnot  exists!');
  }
  });
};

exports.NewContest = async(req,res)=>{
  // console.log(JSON.stringify(req.body));
  const { email } = req.body;
  const data = {"contestName": req.body.contestName, "startTime": req.body.startTime, "link":req.body.link};
  await User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      // await User.findOneAndUpdate({email: req.body.email}, {$push: {data: data}});
      await user.data.push({data:data});
      await user.save();
      return res.send(user);
  } else {
       return res.status(400).send('That user doesnot  exisits!');
  }
  });
}

exports.DeleteContest = async(req,res)=>{
  // console.log(JSON.stringify(req.body));
  const { email } = req.body;
  await User.findOne({'data': {$elemMatch: {_id:req.body._id}}}).exec(async (err, user) => {
      if (err){
        console.log(err);
          return res.status(400).send("some error have been occured retry");
      }    
      if (user) {
          console.log("datafound");
          await user.data.pull({ _id:req.body._id });
          await user.save();
          return res.status(200).send(user);
          
  
      } else {
          console.log("data not found");
          return res.status(400).send('the contest doesnot exist');
  
      }
});
}


exports.Remind =(req, res) => {
console.log('hello');
const mailOptions = {
      from: 'cptracker.nitm@gmail.com',
      to: 'sravzyasudha512000@gmail.com',
      subject: 'Email from Node-App: A Test Message!',
      text: 'Some content to send'
 };

// e-mail transport configuration
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cptracker.nitm@gmail.com',
        pass: 'Sudha123'
      }
  });

cron.schedule('* * * * *', () => {
// Send e-mail
transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });
});
}

exports.Check = (req, res)=>{
  console.log(JSON.stringify(req.body.name));
    res.send( JSON.stringify(req.body.name));
};
