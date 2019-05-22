class CanvasEagle {
  constructor(elm) {
    this.paintCanvas = document.querySelector(elm);
    this.paintContext = this.paintCanvas.getContext('2d');
    this.drawCanvas = document.createElement('canvas');
    this.drawCtx = this.drawCanvas.getContext('2d');
    // this.paintContext.imageSmoothingEnabled = false;
    // this.paintContext.mozImageSmoothingEnabled = false;
    // this.paintContext.webkitImageSmoothingEnabled = false;
    this.drawCanvas.height = this.paintCanvas.height;
    this.drawCanvas.width = this.paintCanvas.width;

    this.context = this.drawCtx;
    this.drawer = {
      click: false,
      move: false,
      pos: { x: 0, y: 0 },
      pos_prev: {},
      tool: 'line',
      flag: false,
      dot_flag: false,
      color: 'black',
      scaleFactor: 1,
      width: this.paintCanvas.width,
      height: this.paintCanvas.height,
      lineWidth: 2,
    };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.debug = true;
    this.initListener();
    // this.createGrid();
  }

  log(message) {
    if (this.debug)
      console.log(JSON.stringify(message));
  }

  setDrawer(drawer) {
    this.drawer = drawer;
  }

  initListener() {

    this.paintCanvas.addEventListener("mousemove", (e) => {
      this.findxy('move', e)
    }, false);
    this.paintCanvas.addEventListener("mousedown", (e) => {
      this.findxy('down', e)
    }, false);
    this.paintCanvas.addEventListener("mouseup", (e) => {
      this.findxy('up', e)
    }, false);
    this.paintCanvas.addEventListener("mouseout", (e) => {
      this.findxy('out', e)
    }, false);
  }

  findxy(res, e) {
    var rect = this.paintCanvas.getBoundingClientRect();
    if (res === 'down') {
      this.drawer.pos_prev.x = this.drawer.pos.x;
      this.drawer.pos_prev.y = this.drawer.pos.y;
      this.drawer.pos.x = e.clientX - rect.left;
      this.drawer.pos.y = e.clientY - rect.top;

      this.drawer.flag = true;
      this.context.beginPath();
      this.context.moveTo(this.drawer.pos.x, this.drawer.pos.y);
      this.updatePaintCanvas();
    }
    if (res === 'up' || res === "out") {
      this.drawer.flag = false;
      this.context.restore();
      this.updatePaintCanvas();

    }
    if (res === 'move') {
      if (this.drawer.flag) {
        this.drawer.pos_prev.x = this.drawer.pos.x;
        this.drawer.pos_prev.y = this.drawer.pos.y;
        this.drawer.pos.x = e.clientX - rect.left;
        this.drawer.pos.y = e.clientY - rect.top;
        this.draw();
        this.updatePaintCanvas();

      }
    }
  }

  updatePaintCanvas() {
    this.paintContext.clearRect(0,
      0,
      this.paintContext.canvas.width,
      this.paintContext.canvas.height);
    this.paintContext.save();
    this.paintContext.translate(this.drawer.width * 0.5, this.drawer.height * 0.5);
    this.paintContext.scale(this.drawer.scaleFactor, this.drawer.scaleFactor);
    this.paintContext.drawImage(this.drawCanvas,
      -this.drawer.width * 0.5,
      -this.drawer.height * 0.5);
    this.paintContext.restore();
  }

  draw() {
    if (this.drawer.flag) {
      this.paintCanvas.dispatchEvent(new CustomEvent('draw', { detail: this.drawer }));
      //this.context.beginPath();
      this.drawing(this.drawer);
    } else {

    }
  }

  drawing(drawer) {
    if (drawer.tool === 'eraser') {

      //this.context.globalCompositeOperation = "destination-out";

      const x = drawer.pos.x;
      const y = drawer.pos.y;
      const radius = drawer.lineWidth;

      this.context.beginPath();
      this.context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
      this.context.closePath();
    } else {
      this.context.globalCompositeOperation = "source-over";
      this.context.lineTo(drawer.pos.x, drawer.pos.y);
      this.context.strokeStyle = drawer.color;
      this.context.lineWidth = drawer.lineWidth;
      this.context.stroke();
    }
  }

  drawRemote(drawer) {
    console.log('drawe');
    this.context.beginPath();
    if (drawer.tool === 'eraser') {
      // this.context.strokeStyle = 'white';
      // this.context.fillStyle = 'rgba(0,0,0,1)';
      // this.context.lineWidth = drawer.lineWidth;
      // this.context.arc(drawer.pos.x, drawer.pos.y, 12, 0, Math.PI * 2, false);
      // this.context.fill();
      const x = drawer.pos.x;
      const y = drawer.pos.y;
      const radius = drawer.lineWidth;
      this.context.beginPath();
      this.context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
      this.context.closePath();
    } else {
      this.context.moveTo(drawer.pos_prev.x, drawer.pos_prev.y);
      this.context.globalCompositeOperation = "source-over";
      this.context.lineTo(drawer.pos.x, drawer.pos.y);
      this.context.strokeStyle = drawer.color;
      this.context.lineWidth = drawer.lineWidth;
      this.context.stroke();
    }

    this.updatePaintCanvas();
  }


  createGrid() {
    let tileSize = 24;
    let t = this.drawCanvas.width / tileSize; // how big the grid is on each side, number of tiles
    if (t > 1) {
      this.context.lineWidth = 2 / this.drawer.scaleFactor;
      this.context.strokeStyle = "#aaa";
      for (let i = 1; i < t; ++i) {
        this.context.moveTo(i * tileSize, 0);
        this.context.lineTo(i * tileSize, this.drawCanvas.width);
        this.context.moveTo(0, i * tileSize);
        this.context.lineTo(this.drawCanvas.width, i * tileSize);
        this.context.stroke();
      }
      this.updatePaintCanvas();
    }
    return null;
  }

  updatePalette() {
    this.context.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
    this.context.save();
    this.context.translate(this.drawer.height * 0.5, this.drawer.width * 0.5);
    this.context.scale(this.drawer.scaleFactor, this.drawer.scaleFactor);
    this.context.drawImage(this.drawCanvas, -this.drawer.height * 0.5, -this.drawer.width * 0.5);
    this.context.restore();
  }

  clear() {
    this.context.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
    this.updatePaintCanvas();

  }

  setColor(color) {
    this.drawer.color = color;
    return this;
  }

  setBigger() {
    this.drawer.lineWidth += 1;
    return this;
  }

  setSmaller() {
    this.drawer.lineWidth -= 1;
    return this;
  }


  setZoomIn(e) {
    e.preventDefault();
    this.drawer.scaleFactor += 0.2;
    this.updatePaintCanvas();

  }

  setZoomOut(e) {
    e.preventDefault();
    this.drawer.scaleFactor -= 0.2;
    this.updatePaintCanvas();
  }


  setTool(name) {
    this.drawer.tool = name;
    return this;
  }
}
