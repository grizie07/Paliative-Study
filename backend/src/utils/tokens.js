import jwt from "jsonwebtoken";

function signAccessToken(payload, env) {
  return jwt.sign(
    {
      sub: payload.userId,
      role: payload.role,
      email: payload.email
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: `${env.ACCESS_TOKEN_MIN || 30}m`
    }
  );
}

function signRefreshToken(payload, env) {
  return jwt.sign(
    {
      sub: payload.userId
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.REFRESH_TOKEN_DAYS || 7}d`
    }
  );
}

export { signAccessToken, signRefreshToken };