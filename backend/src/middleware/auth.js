import jwt from "jsonwebtoken";

function auth(env) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";

      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

      req.user = {
        id: decoded.sub || decoded.userId,
        role: decoded.role,
        email: decoded.email
      };

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }
  };
}

export { auth };