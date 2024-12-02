// This middleware will set the Authorization header and will refresh accessToken on expire. 
// if we use this middleware , we won't have to explicitly make a request to refresh-token api url

import IsTokenExpired from "../utils/IsTokenExpired.js";
import RefreshToken from "../utils/RefreshToken.js";
import setTokenCookies from "../utils/setTokenCookies.js";


const AccessTokenAutoRefresh = async(req,res,next) => {
  try {    
     // extract accessToken & refreshToken from cookies
     const accessToken = req.cookies.accessToken;
     
     if(accessToken || !IsTokenExpired(accessToken)) {
         req.headers['authorization'] = `Bearer ${accessToken}`
        };

     if(!accessToken || IsTokenExpired(accessToken)) {
            // Attempt to get a new accessToken using refresh token
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken){
                throw new Error('Refresh token is missing')
            };

            // Accesstoken is expired, make a new refresh token request 
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await RefreshToken(req,res);

            // set this newly accessToken to cookies
            setTokenCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp );
            
            req.headers['authorization'] = `Bearer ${newAccessToken}`
            
     };
 
     next();
  } catch (error) {
        console.error('Error in adding accessToken to header: ',error.message); 
        res.status(401).json({ error: 'Unauthorized', message: "accessToken is missing or Invalid" });
  }
}

export default AccessTokenAutoRefresh