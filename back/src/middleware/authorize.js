/* Contains some middlewares to re-use
 * */

// no need for try...catch block
const asyncHandler = require("express-async-handler");

// check userid === self
const userid = (req, res, next) => {
  if (req.params.userid !== req.user.id) return res.sendStatus(404);
  next();
};

module.exports = {
  userid,
};
