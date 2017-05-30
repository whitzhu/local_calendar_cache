module.exports = function auth(req, res, next){
  console.log( 'req.query.code===', req.query.code);
  req.code = req.query.code;
  next();
}