import jwt from "jsonwebtoken";

const IsTokenExpired = (token) => {
 if(!token){
    return true;
 };
 const decodedToken = jwt.decode(token);
 const currentTime = Date.now()/1000;
 return decodedToken.exp < currentTime;
}

export default IsTokenExpired;