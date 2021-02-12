console.log('working')

var webglBackend;
try {
  webglBackend = new fabric.WebglFilterBackend();
} catch (e) {
  console.log(e)
}
var canvas2dBackend = new fabric.Canvas2dFilterBackend()

fabric.filterBackend = fabric.initFilterBackend();
fabric.Object.prototype.transparentCorners = false;
var $ = function (id) { return document.getElementById(id) };

function applyFilter(index, filter) {
  var obj = canvas.getActiveObject();
  obj.filters[index] = filter;
  var timeStart = +new Date();
  obj.applyFilters();
  var timeEnd = +new Date();
  var dimString = canvas.getActiveObject().width + ' x ' +
    canvas.getActiveObject().height;
  // $('bench').innerHTML = dimString + 'px ' +
    // parseFloat(timeEnd - timeStart) + 'ms';
  canvas.renderAll();
}

function getFilter(index) {
  var obj = canvas.getActiveObject();
  return obj.filters[index];
}

function applyFilterValue(index, prop, value) {
  var obj = canvas.getActiveObject();
  if (obj.filters[index]) {
    obj.filters[index][prop] = value;
    var timeStart = +new Date();
    obj.applyFilters();
    var timeEnd = +new Date();
    var dimString = canvas.getActiveObject().width + ' x ' +
      canvas.getActiveObject().height;
    // $('bench').innerHTML = dimString + 'px ' +
      // parseFloat(timeEnd - timeStart) + 'ms';
    canvas.renderAll();
  }
}
var canvasheight = document.getElementsByClassName('canvas')[0].clientHeight
var canvaswidth = document.getElementsByClassName('canvas')[0].clientWidth
window.addEventListener("resize",()=>{
    canvasheight = document.getElementsByClassName('canvas')[0].clientHeight
    canvaswidth = document.getElementsByClassName('canvas')[0].clientWidth
})
console.log(canvaswidth)
const initCanvas = (id) => {
  return new fabric.Canvas("cnv", {
    width: canvaswidth,
    height: canvasheight,
  });
}

const setBackground = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    canvas.backgroundImage = img
    canvas.renderAll()
  })
}

const toggleMode = (mode) => {

  if (mode === modes.pan) {
    if (currentMode === modes.pan) {
      canvas.selection = true
      currentMode = ''
    } else {
      currentMode = modes.pan
      canvas.selection = false
      canvas.isDrawingMode = false;
      canvas.renderAll()
    }
  } else if (mode === modes.drawing) {
    if (currentMode === modes.drawing) {
      currentMode = ''
      canvas.selection = true
      canvas.isDrawingMode = false;
      canvas.renderAll()
    } else {
      currentMode = modes.drawing
      canvas.freeDrawingBrush.color = color
      canvas.isDrawingMode = true
      canvas.renderAll()
    }
  }
  console.log(mode);
}

const setPanEvents = (canvas) => {
  //mouse:over
  canvas.on('mouse:move', (event) => {
    // console.log(e)
    if (mousePresed && currentMode === modes.pan) {
      canvas.setCursor('grab')
      canvas.renderAll()
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
      canvas.relativePan(delta)
    }
  })
  //keep track of mouse dovn/up
  canvas.on('mouse:down', (event) => {
    mousePresed = true;
    if (currentMode === modes.pan) {
      canvas.setCursor('grab')
      canvas.renderAll()
    }
  })

  canvas.on('mouse:up', (event) => {
    mousePresed = false;
    canvas.setCursor('default')
    canvas.renderAll()
  })
}

const setColorListner = () => {
  const picker = document.getElementById('colorPicker')
  picker.addEventListener('change', (event) => {
    console.log(event.target.value)
    color = event.target.value
    canvas.freeDrawingBrush.color = color
    canvas.renderAll()
  })
}

const setBrushListner = () => {
  const picker = document.getElementById('brush')
  picker.addEventListener('change', (event) => {
    console.log(event.target.value)
    width = event.target.value
    canvas.freeDrawingBrush.width = width
    canvas.renderAll()
  })
}

const setWidthListner = () => {
  const picker = document.getElementById('width')
  picker.addEventListener('change', (event) => {
    console.log(event.target.value)
    width = event.target.value
  })
}

const setHeightListner = () => {
  const picker = document.getElementById('height')
  picker.addEventListener('change', (event) => {
    console.log(event.target.value)
    height = event.target.value
  })
}

const setTextListner = () => {
  const picker = document.getElementById('newText')
  picker.addEventListener('change', (event) => {
    console.log(event.target.value)
    newText = event.target.value
  })
}

const clearCanvas = (canvas, state) => {
  state.val = canvas.toSVG()
  canvas.getObjects().forEach((o) => {
    if (o !== canvas.backgroundImage) {
      canvas.remove(o)
    }
  })
}

deleteObject = (canvas)=> {
  canvas.remove(canvas.getActiveObject());
  canvas.requestRenderAll()
}

const restoreCanvas = (canvas, state, bgUrl) => {
  if (state.val) {
    fabric.loadSVGFromString(state.val, objects => {
      objects = objects.filter(o => o['xlink:href'] !== bgUrl)
      canvas.add(...objects)
      canvas.requestRenderAll()
    })
  }
}

const createRect = (canvas) => {
  rectColor = color
  console.log("rect")
  const canvasCenter = canvas.getCenter()
  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    left: canvasCenter.left,
    top: canvasCenter.top,
    filter:null,
    originX: 'center',
    originY: 'center',
    fill: rectColor
  })
  canvas.add(rect)
  canvas.requestRenderAll()
  rect.on('selected', () => {
    //rect.set('fill', 'white')
    //canvas.requestRenderAll()
  })
  rect.on('deselected', () => {
    //rect.set('fill', rectColor)
    //canvas.requestRenderAll()
  })
}

const createCirc = (canvas) => {
  circleColor = color
  console.log("circ")
  const canvasCenter = canvas.getCenter()
  const circle = new fabric.Circle({
    radius: 50,
    left: canvasCenter.left,
    top: canvasCenter.top,
    filter:null,
    originX: 'center',
    originY: 'center',
    fill: circleColor
  })
  canvas.add(circle)
  canvas.requestRenderAll()
  circle.on('selected', () => {
    //circle.set('fill', 'white')
    //canvas.requestRenderAll()
  })
  circle.on('deselected', () => {
    //circle.set('fill', circleColor)
    //canvas.requestRenderAll()
  })
}

const groupObjects = (canvas, group, shouldGroup) => {
  if (shouldGroup) {
    const objects = canvas.getObjects()
    group.val = new fabric.Group(objects, { cornerColor: 'gray' })
    clearCanvas(canvas, svgState)
    canvas.add(group.val)
    canvas.requestRenderAll()
  } else {
    group.val.destroy()
    const oldGroup = group.val.getObjects()
    clearCanvas(canvas, svgState)
    canvas.add(...oldGroup)
    group.val = null
    canvas.requestRenderAll()
  }
}

const imgAdded = (e) => {
  const inputElem = document.getElementById('myImage');
  const file = inputElem.files[0];
  reader.readAsDataURL(file)
}

const canvas = initCanvas('cnv'), f = fabric.Image.filters;
const svgState = {}
let mousePresed = false;
let color = '000000'
const group = {};
const bgUrl = 'https://www.euractiv.pl/wp-content/uploads/sites/6/2020/05/max-baskakov-OzAeZPNsLXk-unsplash-scaled-e1588503189401-800x450.jpg'



let currentMode;

const modes = {
  pan: 'pan',
  drawing: 'drawing'
}

canvasResize = (canvas) => {
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.renderAll();
  canvas.calcOffset();
}

canvasStartSize = (canvas)=>{
  canvas.setWidth(canvaswidth);
  canvas.setHeight(canvasheight);
  canvas.renderAll();
  canvas.calcOffset();
}



textAdd=(canvas)=>{
canvas.add(new fabric.Text(newText, { 
  fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100 
}));}


const reader = new FileReader()
var newText=""
var width=300;
var height = 300;

setPanEvents(canvas)

setColorListner()
setWidthListner()
setBrushListner()
setHeightListner()
setTextListner()

//var imageSaver = document.getElementById('lnkDownload');
//imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
  this.href = canvas.toDataURL({
    format: 'png',
    quality: 0.8
  });
  this.download = 'canvas.png'
}

//const inputFile = document.getElementById('myImage');
//inputFile.addEventListener('change', imgAdded)

reader.addEventListener('load', () => {
  console.log(reader.result)
  fabric.Image.fromURL(reader.result, img => {
    canvas.add(img)
    canvas.requestRenderAll()
  })
})

canvas.on({
  'selection:created': function () {
    if(canvas.getActiveObject()._cacheContext==undefined){
    //console.log(canvas.getActiveObject())
    fabric.util.toArray(document.getElementsByClassName('filter'))
      .forEach(function (el) { el.disabled = false; })

    var filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
      'brightness', 'contrast', 'saturation', 'noise', 'vintage',
      'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
      'polaroid', 'blend-color', 'gamma', 'kodachrome',
      'blackwhite', 'blend-image', 'hue', 'resize'];

    for (var i = 0; i < filters.length; i++) {
      $(filters[i]) && (
        $(filters[i]).checked = !!canvas.getActiveObject().filters[i]);
    }}
  },
 'selection:cleared': function () {
    fabric.util.toArray(document.getElementsByClassName('filter'))
      .forEach(function (el) { el.disabled = true; })
  }
});



var indexF;
$('webgl').onclick = function () {
  if (this.checked) {
    fabric.filterBackend = webglBackend;
  } else {
    fabric.filterBackend = canvas2dBackend;
  }
};
$('brownie').onclick = function () {
  applyFilter(4, this.checked && new f.Brownie());
};
$('vintage').onclick = function () {
  applyFilter(9, this.checked && new f.Vintage());
};
$('technicolor').onclick = function () {
  applyFilter(14, this.checked && new f.Technicolor());
};
$('polaroid').onclick = function () {
  applyFilter(15, this.checked && new f.Polaroid());
};
$('kodachrome').onclick = function () {
  applyFilter(18, this.checked && new f.Kodachrome());
};
$('blackwhite').onclick = function () {
  applyFilter(19, this.checked && new f.BlackWhite());
};
$('grayscale').onclick = function () {
  applyFilter(0, this.checked && new f.Grayscale());
};
$('average').onclick = function () {
  applyFilterValue(0, 'mode', 'average');
};
$('luminosity').onclick = function () {
  applyFilterValue(0, 'mode', 'luminosity');
};
$('lightness').onclick = function () {
  applyFilterValue(0, 'mode', 'lightness');
};
$('invert').onclick = function () {
  applyFilter(1, this.checked && new f.Invert());
};
$('remove-color').onclick = function () {
  applyFilter(2, this.checked && new f.RemoveColor({
    distance: $('remove-color-distance').value,
    color: $('remove-color-color').value,
  }));
};
$('remove-color-color').onchange = function () {
  applyFilterValue(2, 'color', this.value);
};
$('remove-color-distance').oninput = function () {
  applyFilterValue(2, 'distance', this.value);
};
$('sepia').onclick = function () {
  applyFilter(3, this.checked && new f.Sepia());
};
$('brightness').onclick = function () {
  applyFilter(5, this.checked && new f.Brightness({
    brightness: parseFloat($('brightness-value').value)
  }));
};
$('brightness-value').oninput = function () {
  applyFilterValue(5, 'brightness', parseFloat(this.value));
};
$('gamma').onclick = function () {
  var v1 = parseFloat($('gamma-red').value);
  var v2 = parseFloat($('gamma-green').value);
  var v3 = parseFloat($('gamma-blue').value);
  applyFilter(17, this.checked && new f.Gamma({
    gamma: [v1, v2, v3]
  }));
};
$('gamma-red').oninput = function () {
  var current = getFilter(17).gamma;
  current[0] = parseFloat(this.value);
  applyFilterValue(17, 'gamma', current);
};
$('gamma-green').oninput = function () {
  var current = getFilter(17).gamma;
  current[1] = parseFloat(this.value);
  applyFilterValue(17, 'gamma', current);
};
$('gamma-blue').oninput = function () {
  var current = getFilter(17).gamma;
  current[2] = parseFloat(this.value);
  applyFilterValue(17, 'gamma', current);
};
$('contrast').onclick = function () {
  applyFilter(6, this.checked && new f.Contrast({
    contrast: parseFloat($('contrast-value').value)
  }));
};
$('contrast-value').oninput = function () {
  applyFilterValue(6, 'contrast', parseFloat(this.value));
};
$('saturation').onclick = function () {
  applyFilter(7, this.checked && new f.Saturation({
    saturation: parseFloat($('saturation-value').value)
  }));
};
$('saturation-value').oninput = function () {
  applyFilterValue(7, 'saturation', parseFloat(this.value));
};
$('noise').onclick = function () {
  applyFilter(8, this.checked && new f.Noise({
    noise: parseInt($('noise-value').value, 10)
  }));
};
$('noise-value').oninput = function () {
  applyFilterValue(8, 'noise', parseInt(this.value, 10));
};
$('pixelate').onclick = function () {
  applyFilter(10, this.checked && new f.Pixelate({
    blocksize: parseInt($('pixelate-value').value, 10)
  }));
};
$('pixelate-value').oninput = function () {
  applyFilterValue(10, 'blocksize', parseInt(this.value, 10));
};
$('blur').onclick = function () {
  applyFilter(11, this.checked && new f.Blur({
    value: parseFloat($('blur-value').value)
  }));
};
$('blur-value').oninput = function () {
  applyFilterValue(11, 'blur', parseFloat(this.value, 10));
};
$('sharpen').onclick = function () {
  applyFilter(12, this.checked && new f.Convolute({
    matrix: [0, -1, 0,
      -1, 5, -1,
      0, -1, 0]
  }));
};
$('emboss').onclick = function () {
  applyFilter(13, this.checked && new f.Convolute({
    matrix: [1, 1, 1,
      1, 0.7, -1,
      -1, -1, -1]
  }));
};
$('blend').onclick = function () {
  applyFilter(16, this.checked && new f.BlendColor({
    color: document.getElementById('blend-color').value,
    mode: document.getElementById('blend-mode').value,
    alpha: document.getElementById('blend-alpha').value
  }));
};

/*$('blend-mode').onchange = function () {
  applyFilterValue(16, 'mode', this.value);
};

$('blend-color').onchange = function () {
  applyFilterValue(16, 'color', this.value);
};

$('blend-alpha').oninput = function () {
  applyFilterValue(16, 'alpha', this.value);
};*/

$('hue').onclick = function () {
  applyFilter(21, this.checked && new f.HueRotation({
    rotation: document.getElementById('hue-value').value,
  }));
};

$('hue-value').oninput = function () {
  applyFilterValue(21, 'rotation', this.value);
};
/*
$('blend-image').onclick = function () {
  applyFilter(20, this.checked && new f.BlendImage({
    image: fImage,
  }));
};

$('blend-image-mode').onchange = function () {
  applyFilterValue(20, 'mode', this.value);
};
*/

const accordion = document.querySelectorAll("#accordion .title");
console.log(accordion)

for(let i = 0; i<accordion.length; i++){
    accordion[i].addEventListener('click', function(){
       this.classList.toggle("active");
       var panel = this.nextElementSibling;
       if (panel.style.display === "block") {
         panel.style.display = "none";
       } else {
         panel.style.display = "block";
       }
    })
}
