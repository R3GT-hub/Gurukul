const JWT=require('jsonwebtoken');

const secret="SaranshSDEAmazon";

function createTokenForUser(user){
const payload={
    _id:user._id,
    email:user.email,
    profileImageURL:user.profileImageURL,
    role:user.role,
    fullName:user.fullName,
};
const token=JWT.sign(payload,secret,{expiresIn:'120m'});//120 minutes
return token;
}


function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,validateToken
}