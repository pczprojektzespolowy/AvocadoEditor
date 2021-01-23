console.log('working')

const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        selection: false
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
            currentMode = ''
        } else {
            currentMode = modes.pan
            canvas.isDrawingMode = false;
            canvas.renderAll()
        }
    } else if (mode === modes.drawing) {
        if (currentMode === modes.drawing) {
            currentMode = ''
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

const clearCanvas = (canvas, state) => {
    state.val = canvas.toSVG()
    canvas.getObjects().forEach((o) => {
        if (o !== canvas.backgroundImage) {
            canvas.remove(o)
        }
    })
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
        originX: 'center',
        originY: 'center',
        fill: rectColor,
        cornerColor: 'white'
    })
    canvas.add(rect)
    canvas.requestRenderAll()
    rect.on('selected', () => {
        rect.set('fill', 'white')
        canvas.requestRenderAll()
    })
    rect.on('deselected', () => {
        rect.set('fill', rectColor)
        canvas.requestRenderAll()
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
        originX: 'center',
        originY: 'center',
        fill: circleColor,
        cornerColor: 'white'
    })
    canvas.add(circle)
    canvas.requestRenderAll()
    circle.on('selected', () => {
        circle.set('fill', 'white')
        canvas.requestRenderAll()
    })
    circle.on('deselected', () => {
        circle.set('fill', circleColor)
        canvas.requestRenderAll()
    })
}

const groupObjects = (canvas, group, shouldGroup) => {
    if (shouldGroup) {
        const objects = canvas.getObjects()
        group.val = new fabric.Group(objects, { cornerColor: 'gray' })
        clearCanvas(canvas,svgState)
        canvas.add(group.val)
        canvas.requestRenderAll()
    } else {
        group.val.destroy()
        const oldGroup = group.val.getObjects()
        clearCanvas(canvas,svgState)
        canvas.add(...oldGroup)
        group.val = null
        canvas.requestRenderAll()
    }
}

const imgAdded = (e) =>{
    const inputElem = document.getElementById('myImage');
    const file =inputElem.files[0];
    reader.readAsDataURL(file)
}

const canvas = initCanvas('workspace');
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

const reader = new FileReader()

setBackground(bgUrl, canvas)

setPanEvents(canvas)

setColorListner()

const inputFile = document.getElementById('myImage');
inputFile.addEventListener('change', imgAdded)
reader.addEventListener('load', () => {
    console.log(reader.result)
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img)
        canvas.requestRenderAll()
    })
})