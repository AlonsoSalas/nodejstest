import express from 'express';
import socket from 'socket.io';
import path from 'path';
import _ from 'lodash';
import moment from 'moment';

const app = express();

const port = process.env.PORT || 3000;

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/assets')));

app.use(function(req, res, next) {

    res.status(404).send({
        message: "No HTTP resource was found that matches the request URI",
        endpoint: req.url,
        method: req.method
    });
});

app.use(function(err, req, res, next) {
    // console.error(err.stack);
    res.status(500).json(err);
});

const server = app.listen(app.get('port'), (error) => {
    if (error)
        throw error;
    else
        console.info(`sever running on port ${port}`);

});

const io = socket(server);

const uids = [];
const usersConnected = [];

io
    .of('/box')
    .on('connection', function(socket) {
        let uid  = null;

        socket.on('updated:time',function (data) {

            socket.broadcast.emit('user:newtime',data)

        })

        socket.on('user:connected', function(data) {
            uid = data.uid;

            if (!uids.includes(uid)) {
                uids.push(uid)
            }

            if  ( !_.find(usersConnected, user => user.uid === data.uid ) ) {
                socket.broadcast.emit('new:connected', data);
                usersConnected.push(data);
            }

            socket.emit('previous:connected', usersConnected);

        });

        socket.on('disconnect', function() {
            uids.splice(uids.indexOf(uid),1);
            setTimeout(() => {
                if (!uids.includes(uid)) {
                    socket.broadcast.emit('user:disconnected',uid)
                    usersConnected.splice(usersConnected.indexOf(uid),1);
                }
            },2000)

        });
    });
