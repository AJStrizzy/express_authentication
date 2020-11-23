'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len:{
          args: [1,99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { 
          msg: ' Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  user.addHook('beforeCreate', function(pendingUser) {
    // encryot hash a password for use
    let hash = bcrypt.hashSync(pendingUser.password, 12)
    //set the password to be equal to hash
    pendingUser.password = hash
    console.log(pendingUser)
  })
  
  user.prototype.validPassword = function(passwordType) {
    let correctPassword = bcrypt.compareSync(passwordType, this.password)
    console.log('valid password', correctPassword)
    //return true or falso based on correct password or not
    return correctPassword
  }
  
  //remove the password before it gets serialized
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password
    console.log(userData)
    return userData
  }
  return user;
};

