'use strict'
/*アプリのメイン機能部分 /posts に対する具体的な処理（投稿表示や投稿追加など）*/
const pug = require('pug')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });
const util = require('./handler-util')

async function handle(req,res){
  switch (req.method){
    case 'GET':
      res.writeHead(200,{
        'Content-Type':'text/html; charset=utf-8'
      });
      const posts = await prisma.post.findMany({
        orderBy: {
          id: 'desc'
        }
      });
      posts.forEach((post) => {
        post.content = post.content.replaceAll('\n', '<br>');
      });
      res.end(pug.renderFile('./views/posts.pug',{
        posts, user: req.user
      }));
      console.info(
        `閲覧されました: user: ${req.user}, ` +
        `remoteAddress: ${req.socket.remoteAddress}, ` +
        `userAgent: ${req.headers['user-agent']} `
      )
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk)=>{
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const content = params.get('content');
        console.info(`送信されました:${content}`)
        await prisma.post.create({
          data: {
            content,
            postedBy: req.user
          }
        });
        handleRedirectPosts(req,res);
      });
      break;
    default:
        util.handleBadRequest(req,res);
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function handleDelete(req,res) {
  switch (req.method) {
    case 'POST':
      let body = '';
      req.on('data',(chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const id = parseInt(params.get('id'));
        const post = await prisma.post.findUnique({where: {id}});
        if (req.user === post.postedBy || req.user === 'admin') {
          await prisma.post.delete({where: {id}});
          console.info(
            `削除されました: user: ${req.user}, ` +
            `remoteAddress: ${req.socket.remoteAddress}, ` +
            `userAgent: ${req.headers['user-agent']} `
          );
          handleRedirectPosts(req,res);
        }
      });
      break;
    default:
      util.handleBadRequest(req,res);
      break;
  }
}

module.exports = {
  handle,
  handleDelete,
}
