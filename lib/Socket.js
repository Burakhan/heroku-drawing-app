let _ = require('lodash');

/**
 * Starts and handles the socket connection
 */
class Socket {
  constructor() {
    this.line_history = {};
  }

  /**
   * Opens a socket connection
   * @param {SocketIO.Server} socket - a socket.io wrapper
   */
  init(socket) {
    try {
      if (!this.io) this.io = socket;

      this.io.on('connection', (socket) => {
        console.log('Conneting web socket !!!');

        socket.on('draw_line', (data) => {
          this.line_history[socket.room].push(data);
          socket.broadcast.to(socket.room).emit('draw_line', { draw: data });
        });

        socket.on('joinRoom', (data) => {
          socket.room = data.roomId;
          if (!this.line_history.hasOwnProperty(socket.room)) {
            this.line_history[socket.room] = [];
          }
          socket.join(socket.room);
          for (var i in this.line_history[socket.room]) {
            this.io.to(socket.id).emit('draw_line',
              { draw: this.line_history[socket.room][i] });
          }

        });
        socket.on('disconnect', function () {
        });

      });
    }
    catch (err) {
      Logger.error(err);
    }
  }
}

module.exports = new Socket();
