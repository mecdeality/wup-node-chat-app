var express   = require('express');
var app       = express();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// app.use/routes/etc...

var server    = app.listen(3000);
var io        = require('socket.io')(server);

var names = {};

app.get('/', (req, res) => {
  res.redirect('/reg');
})

app.get('/reg', (req, res) => {
  res.render('reg');
})

app.post('/chat', (req, res) => {
  res.render('index', {name: req.body.input});
})

io.on('connection', socket => {
  console.log('connection');
  socket.on('reg-name', data => {
    names[socket.id] = data;
    socket.broadcast.emit('user-joined', names[socket.id] )
    // socket.emit('connected', )
    console.log(names);
    
  })
  socket.on('msg-send', data => {
    socket.broadcast.emit('msg-get', {data, name: names[socket.id]});
  })
  socket.on('disconnect', ()=>{
    socket.broadcast.emit('user-disconnected', names[socket.id] )
    io.to(socket.id).emit('redirect', '/');
    delete names[socket.id];
    console.log(names);
    console.log('disconnected');
  })
})


// http.listen(process.env.PORT || 3000, () => {
//   console.log('listening on *:3000');

// })
// app.listen(process.env.PORT || 3000);