'use strict';
/*受け取ったリクエストURLで振り分けて、該当するハンドラーを呼ぶ*/
const postsHandler = require('./posts-handler');
const util = require('./handler-util')

function route(req,res){
  switch (req.url) {
    case '/posts':
      postsHandler.handle(req,res);
      break;
    case '/posts/delete':
      postsHandler.handleDelete(req,res);
      break;
    case '/logout':
    util.handleLogout(req,res);
      break;
    default:
      util.handleNotFound(req,res);
      break;
  }
}

module.exports = {
  route
};
