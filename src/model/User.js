const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    username: { type: String, unique: true },
    password: {
      type: String,
      required: true
    },

    verified: {
      type: Boolean,
      required: true,
      default: false
    },

    accountActivated: {
      type: Boolean,
      required: true,
      default: false
    },

    

    createdAt: {
      type: Date,
      default: Date.now,
      expireAfterSeconds: 600,
      partialFilterExpression: { verified: false }
    },
    
   
  },
  { timestamps: true },
  { minimize: false }
);

module.exports = mongoose.model('User', userSchema);
