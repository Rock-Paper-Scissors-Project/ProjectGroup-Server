const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = 3000
const io = require('socket.io')(http)
// const router = require('./routes/index')
const cors = require('cors')
app.use(cors())
app.use(express.json())
// app.use(router)
users = [];
connections = [];
choices = [];

// io.on('connection', function (socket) {
//     socket.emit('news', { hello: 'world' });
//     socket.on('my other event', function (data) {
//       console.log(data);
//     });
//   });

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1)
        io.emit('disconnected', socket.username);
        console.log('Disconnected: %s sockets connected', connections.length);    
    });

    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    socket.on('add user', function(data, callback) {
        socket.username = data;

        if(users.indexOf(socket.username) > -1)
        {
            // callback(false);
        }
        else
        {
            users.push(socket.username);
            updateUsernames();
            console.log(socket.username);
            
            // callback(true);

            if (Object.keys(users).length == 2)
            {
                io.emit('connected', socket.username);
                io.emit('game start');
            }
        }
    });

    socket.on('player choice', function (username, choice) {
        choices.push({'user': username, 'choice': choice});
        console.log('%s chose %s.', username, choice);
        
        if(choices.length == 2) 
        {
            console.log('[socket.io] Both players have made choices.');

            switch (choices[0]['choice'])
            {
                case 'rock':
                    switch (choices[1]['choice'])
                    {
                        case 'rock': 
                            io.emit('tie', choices);
                            break;

                        case 'paper':
                            io.emit('player 2 win', choices);               
                            break;
        
                        case 'scissors':
                            io.emit('player 1 win', choices);
                            break;

                        default:
                            break;
                    }
                    break;

                case 'paper':
                    switch (choices[1]['choice'])
                    {
                        case 'rock':
                            io.emit('player 1 win', choices);     
                            break;

                        case 'paper':
                            io.emit('tie', choices);
                            break;
        
                        case 'scissors':
                            io.emit('player 2 win', choices);
                            break;

                        default:
                            break;
                    }
                break;

                case 'scissors':
                    switch (choices[1]['choice'])
                    {
                        case 'rock':
                            io.emit('player 2 win', choices);    
                            break;

                        case 'paper':
                            io.emit('player 1 win', choices); 
                            break;
        
                        case 'scissors':
                            io.emit('tie', choices);
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }

            choices = [];
        }
    });

    function updateUsernames() {
        console.log("kirim ke client>>>",users);
        
        io.sockets.emit('get user', users);
    }
})

http.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})
