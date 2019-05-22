var Canvas = {};

(function() {
  var canvas = document.getElementById('drawing'),
    context = canvas.getContext('2d');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
    drawStuff();
  }
  resizeCanvas();

  function drawStuff() {
    // do your drawing stuff here
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const socket = io.connect();
  socket.on('connect', function () {
    socket.emit('joinRoom', { roomId: drawRoom });
  });
  Canvas = new CanvasEagle('#drawing');

  Canvas.paintCanvas.addEventListener('draw', function (data) {
    socket.emit('draw_line', data.detail);
  });

  socket.on('draw_line', function (data) {
    Canvas.drawRemote(data.draw);
  });
});
