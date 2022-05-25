const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
   name: {
      type: String,
      required: true,
    },
    data : [new mongoose.Schema({
      contestName: {type: String},
      startTime : {type: String},
      link:{type:String},   
  }, {strict: false})
  ]
  },
  {strict: false},
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("user", userSchema);
