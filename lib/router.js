'use strict';
const postsHandler = require('./posts-handler');

function route(req,res){
  switch (req.url) {
    case '/posts':
      postsHandler.handle(req,res);
      break;
    case '/logout':
      // ログアウト処理
      break;
    default:
      res.end('トップページ作成予定')
      break;
  }
}

module.exports = {
  route
};
