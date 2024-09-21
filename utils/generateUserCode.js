const {  Authentication } = require('../models'); // Import the User model

const generateUserCode = async () => {
  let userCode;
  let isUnique = false;

  while (!isUnique) {

    userCode = Math.floor(1000000 + Math.random() * 9000000); 
    const existingUser = await Authentication.findOne({ where: { user_code: userCode }});
    if (!existingUser) {
      isUnique = true;
    }
  }
  console.log(userCode);
  
  return userCode.toString(); 
};

module.exports = generateUserCode;
