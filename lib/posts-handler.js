'use strict'
const pug = require('pug')
const contents = [];

function handle(req,res){
  switch (req.method){
    case 'GET':
      res.writeHead(200,{
        'Content-Type':'text/html; charset=utf-8'
      });
      res.end(pug.renderFile('./views/posts.pug'));
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk)=>{
        body += chunk;
      }).on('end',() => {
        const params = new URLSearchParams(body);
        const content = params.get('content');
        contents.push(content);
        console.info(`送信されました:${content}`)
        console.info(`送信された全内容: ${contents}`);
        handleRedirectPosts(req,res);
      });
      break;
    default:
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle
}
