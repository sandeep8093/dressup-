const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    let user;
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            err = {
                name: 'TokenExpiredError',
                message: 'auth token expired'
            }
            return res.status(400).json(err);
        }
    }
    req.user = user;

    if (!user) {
        return res.status(400).json({ error: 'auth token not found' });
    }
    next();
}

exports.verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id ) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

exports.getUser = (req, res, next) => {
    let user;
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            err = {
                name: 'TokenExpiredError',
                message: 'auth token expired'
            }
            return res.status(400).json(err);
        }
    }
    req.loggedInUser = user;
    next();
}