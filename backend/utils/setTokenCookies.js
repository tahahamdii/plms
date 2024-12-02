const setTokenCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
  // Calculate the expiration time for the access token
  const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // Set cookies for access token
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    sameSite: 'None', // Allows cookies to be sent with cross-site requests
    maxAge: accessTokenMaxAge,
  });

  // Set cookies for refresh token
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    sameSite: 'None', // Allows cookies to be sent with cross-site requests
    maxAge: refreshTokenMaxAge,
  });

  // Set cookie for is_auth (if needed)
  res.cookie('is_auth', true, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // Should also be secure in production if used
    sameSite: 'None', // Allows cookies to be sent with cross-site requests
    maxAge: refreshTokenMaxAge,
  });
};

export default setTokenCookies;
