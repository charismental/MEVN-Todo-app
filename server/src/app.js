const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Post = require('../models/post')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

app.get('/posts', (req, res) => {
  Post.find({}, 'title description', (error, posts) => {
    if (error) { console.error(error) }
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

app.get('/posts/:id', (req, res) => {
  const db = req.db
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) { console.error(error) }
    res.send(post)
  })
})

app.put('/posts/:id', (req, res) => {
  const db = req.db
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) { console.error(error) }

    post.title = req.body.title
    post.description = req.body.description
    post.save(error => {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

app.post('/posts', (req, res) => {
  const db = req.db
  const title = req.body.title
  const description = req.body.description
  const new_post = new Post({
    title: title,
    description: description
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully'
    })
  })
})

app.listen(process.env.PORT || 8081)
