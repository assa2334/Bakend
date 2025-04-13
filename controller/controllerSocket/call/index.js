const functi = {}
const UserModel = require('../../../model/User');


functi.checkUseOnline = async (receiver) => {
  try {
    let user = await UserModel.findOne({ _id: receiver });
    if (!user) {
        return false;
    } else if (user.online == "active") {
        return true;
    }
    else{
        return false
    }
  } catch (error) {
    console.log("some error user data get 1",error); 
  }
}
functi.getUserdetail = async (sender)=>{
    try {
        let user = await UserModel.findOne({ _id:sender});
    if (!user) {
        return false;
    } else if (user.online == "active") {
        return user;
    }
    else{
        return false
    } 
    } catch (error) {
        console.log("some error user data get 2",error); 
    }
}

module.exports = functi;