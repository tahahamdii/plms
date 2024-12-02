import IsTokenExpired from "../utils/IsTokenExpired.js";

// This middleware will set Authorization to the header 
const SetAuthHeader = async(req,res,next) => {
 try {
    // extract accessToken from cookies
    const accessToken = req.cookies.accessToken;

    if(accessToken || !IsTokenExpired(accessToken)) {
        req.headers['Authorization'] = `Bearer ${accessToken}`
    };

    next();
 } catch (error) {
    console.error('Error in adding accessToken to header: ',error.message); 
 }
}

export default SetAuthHeader;






// This middleware has no longer use, because this only set the Authorization to the header, but the copying of accesstoken we have to do manually, so we will create a new middleware, which will automatically set the authorization and no need to call the refreshToken again and again. It will all automatically. 

// Our new middleware is : accessTokenAutoRefresh