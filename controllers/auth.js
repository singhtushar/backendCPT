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

// exports.Register = async (req, res) => {
//   const { email, name } = req.body;
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     auth: {
//       // user: `${process.env.EMAIL_ID}`,
//       // pass: `${process.env.PASSWORD}`,
//     },
//   });
//   transporter.verify((error, success) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take messages");
//     }
//   });

//   User.find().exec((err, user) => {
//     if (user) {
//       const pid = user.length + 1;

//       User.findOne({ email }).exec(async (err, user) => {
//         if (user) {
//           user.storage = storage;
//           user.ram = ram;
//           await user.save(async (err) => {
//             if (err) {
//               return res.json({
//                 error: "problem while saving data to database",
//               });
//             } else {
//               console.log("data updated");

//               const mailOptions = {
//                 from: `${process.env.EMAIL_ID}`,
//                 to: `${email}`,
//                 subject: "Updated request for realme 5 ",
//                 html: `
//                 <h2>Hello, you have  updated request for realme 5, Specification included ${storage} internal Storage, ${ram} RAM </h2>
//                 <p> your Registration no. is <strong>${user.pid}</strong></p>`,
//               };

//               transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                   console.log(error);
//                   console.log(
//                     "error while sending the mail check controller/auth"
//                   );
//                 } else {
//                   console.log("Email sent: " + info.response);
//                 }
//               });

//               return res.status(200).json({ user });
//             }
//           });
//         } else {
//           let user = new User({ email, storage, ram, pid });
//           await user.save((err, success) => {
//             if (err) {
//               console.log("error occured in while creating new user.");
//               return res.status(400).json({ error: err });
//             } else {
//               const mailOptions = {
//                 from: `${process.env.EMAIL_ID}`,
//                 to: `${email}`,
//                 subject: "Request made for for realme 5",
//                 html: `<h2>Hello, you have made a new request for realme 5, Specification included ${storage} internal Storage, ${ram} RAM </h2>
//                     <p>Registration no. <strong>${user.pid}</strong></p>`,
//               };

//               transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                   console.log(error);
//                   console.log(
//                     "error while sending the mail check controller/auth"
//                   );
//                 } else {
//                   console.log("Email sent: " + info.response);
//                 }
//               });

//               console.log("successfully created the user");
//               return res.status(200).json({ user });
//             }
//           });
//         }
//       });
//     }
//   });
// };
