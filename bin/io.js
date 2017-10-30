module.exports = function(server){
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {
      console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

      // socket에 클라이언트 정보를 저장한다
      socket.name = data.name;
      socket.userid = data.userid;

    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {

      var msg = {
        from: {
          name: socket.name,
          userid: socket.userid
        },
        msg: data.msg
      };

      io.to(data.toUserId).emit('s2c chat', msg);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
      socket.disconnect();
    })

    socket.on('disconnect', function() {
      console.log('user disconnected: ' + socket.name);
    });
  });

  return io;
}
