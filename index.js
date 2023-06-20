import p5 from 'p5'
import './styles.css'
import html2canvas from 'html2canvas'

import image1Url from './src/images/caveWall1.jpg'
import image2Url from './src/images/caveWall2.jpg'
import image3Url from './src/images/caveWall3.jpg'
import image4Url from './src/images/caveWall4.jpg'
import image5Url from './src/images/caveWall5.jpg'
import image6Url from './src/images/caveWall6.jpg'
import image7Url from './src/images/caveWall7.jpg'
import image8Url from './src/images/caveWall8.jpg'
import image9Url from './src/images/caveWall9.jpg'
import image10Url from './src/images/caveWall10.jpg'
import image11Url from './src/images/caveWall11.jpg'
import image12Url from './src/images/caveWall12.jpg'
import image13Url from './src/images/caveWall13.jpg'

let pot = 880
let dist = 40
let mic = 0

let clearCanvas = false
var changeColor = false
var changeSize = false
var changeHardness = false

let imagePaths = [
  image1Url,
  image2Url,
  image3Url,
  image4Url,
  image5Url,
  image6Url,
  image7Url,
  image8Url,
  image9Url,
  image10Url,
  image11Url,
  image12Url,
  image13Url
]

let imageSelected = imagePaths.at(Math.floor(Math.random() * imagePaths.length))

export const wsConnection = new WebSocket('ws://localhost:3000/websocket')

wsConnection.onopen = function () {
  console.log('Соединение установлено.')
}

wsConnection.onclose = function (event) {
  if (event.wasClean) {
    console.log('Соединение закрыто чисто')
  } else {
    console.log('Обрыв соединения') // например, "убит" процесс сервера
  }
  console.log('Код: ' + event.code + ' причина: ' + event.reason)
}

wsConnection.onerror = function (error) {
  console.log('Ошибка ' + error.message)
}

wsConnection.onmessage = function message(event) {
  console.log(event.data)

  let jsonData = JSON.parse(event.data)
  pot = parseInt(jsonData['p'])
  dist = parseInt(jsonData['d'])
  mic = parseInt(jsonData['m'])
}

function sketch(p) {
  p.setup = () => {
    const canvas = p.createCanvas(1458, 751)
    canvas.parent('WorkSpace')
    p.frameRate(60)

    const saveButton = document.createElement('div')
    saveButton.classList.add('saveButton')
    saveButton.innerText = 'save for stuff'

    saveButton.addEventListener('click', () => {
      p.saveCanvas(canvas, 'myArtwork', 'png')
    })

    const buttonsSet = document.getElementById('buttonsSet')
    buttonsSet.appendChild(saveButton)
  }

  p.draw = () => {
    let colorNumberFromKnobPercentage = (pot * 100) / 1023
    let colorNumber = Math.floor((colorNumberFromKnobPercentage * 360) / 100)

    let micChanged = mic / 100

    if (micChanged < 0) {
      micChanged = 1
    } else if (micChanged > 10) {
      micChanged = 10
    }

    let micFinal = 10 - micChanged

    if (changeColor) {
      document.getElementById(
        'colordiv'
      ).style.color = `hsl(${colorNumber}, 100%, 50%)`
    }

    if (changeSize) {
      document.getElementById('sizediv').style.fontSize = dist + 'px'
    }

    if (changeHardness) {
      document.getElementById(
        'hardnessdiv'
      ).style.filter = `blur(${micFinal}px)`
    }

    p.colorMode(p.HSB)

    p.stroke(colorNumber, 100, 100)
    p.strokeWeight(dist)
    p.drawingContext.filter = `blur(${micFinal}px)`

    if (p.mouseIsPressed) {
      p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)
    }

    if (clearCanvas) {
      p.clear()
      clearCanvas = false
    }
  }
}

function trueColor() {
  changeColor = true
}

function trueSize() {
  changeSize = true
}

function trueHardness() {
  changeHardness = true
}

function saveDivAsJPEG() {
  const div = document.getElementById('WorkSpace')

  const elementsToHide = WorkSpace.querySelectorAll('#bottomManipulators')
  elementsToHide.forEach((element) => {
    element.style.display = 'none'
  })

  html2canvas(div)
    .then(function (canvas) {
      elementsToHide.forEach((element) => {
        element.style.display = ''
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/jpeg')
      link.download = 'cave_drawing.jpeg'
      link.click()
    })
    .catch(function (error) {
      console.error('Ошибка при сохранении изображения:', error)
    })
}

function renderUI() {
  const Container = document.createElement('div')
  Container.classList.add('Container')

  const About = document.createElement('div')
  About.classList.add('About')

  const WorkSpace = document.createElement('div')
  WorkSpace.style.backgroundImage = `url("${imageSelected}")`
  WorkSpace.classList.add('WorkSpace')
  WorkSpace.id = 'WorkSpace'

  const h3 = document.createElement('h3')
  h3.textContent = 'p5 is the new'
  h3.style.gridArea = '1 / 1 / 3 / 5'

  const h4 = document.createElement('h4')
  h4.textContent = 'prehistoric tool'
  h4.style.gridArea = '3 / 1 / 5 / 5'

  const p1 = document.createElement('p')
  p1.textContent =
    '— an instrument that allows you to leave a footprint in history. literally.'
  p1.style.gridColumnStart = '4'
  p1.style.gridColumnEnd = '9'
  p1.style.gridRowStart = '1'
  p1.style.gridRowEnd = '2'
  p1.style.marginLeft = '6px'

  const p2 = document.createElement('p')
  p2.textContent =
    'move from one cave to another and draw pictures. Ancient people have drawn lots of references that you can try to repeat or create something unique.'
  p2.style.gridColumnStart = '5'
  p2.style.gridColumnEnd = '9'
  p2.style.gridRowStart = '2'
  p2.style.gridRowEnd = '5'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('messageBackground')
  svg.setAttribute('width', '156')
  svg.setAttribute('height', '55')
  svg.setAttribute('viewBox', '0 0 156 55')
  svg.setAttribute('fill', 'none')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M150 51L156 1L105 0L54 1L60 37L0 43V49L84 55L150 51Z')
  path.setAttribute('fill', 'black')

  svg.appendChild(path)

  const p3 = document.createElement('p')
  p3.textContent =
    'Remember, the next artist can both add to your image and erase it from history.'
  p3.style.gridArea = '1 / 9 / 5 / 11'
  p3.style.padding = '0 15px'
  p3.style.textAlign = 'center'
  p3.style.color = 'white'
  p3.style.textShadow =
    '-0.2px 0 white, 0 0.2px white, 0.2px 0 white, 0 -0.2px white'

  const h2_1 = document.createElement('h2')
  h2_1.textContent = 'digital'
  h2_1.style.gridColumnStart = '11'
  h2_1.style.gridColumnEnd = '12'
  h2_1.style.gridRowStart = '1'
  h2_1.style.gridRowEnd = '3'

  const p4 = document.createElement('p')
  p4.textContent = 'the set of buttons allows to manipulate the drawing area.'
  p4.style.gridColumnStart = '12'
  p4.style.gridColumnEnd = '16'
  p4.style.gridRowStart = '1'
  p4.style.gridRowEnd = '2'

  const aboutSaveButton = document.createElement('div')
  aboutSaveButton.classList.add('AboutSaveButton')

  const circle1 = document.createElement('div')
  circle1.classList.add('circle')

  const p5 = document.createElement('p')
  p5.style.fontWeight = '700'
  p5.textContent = 'save'

  const p6 = document.createElement('p')
  p6.textContent = 'allows you to save drawn.'

  aboutSaveButton.appendChild(circle1)
  aboutSaveButton.appendChild(p5)
  aboutSaveButton.appendChild(p6)

  const aboutChangeACaveButton = document.createElement('div')
  aboutChangeACaveButton.classList.add('AboutChangeACaveButton')

  const circle2 = document.createElement('div')
  circle2.classList.add('circle')

  const p7 = document.createElement('p')
  p7.style.fontWeight = '700'
  p7.textContent = 'change a cave'

  const p8 = document.createElement('p')
  p8.textContent = 'changes the cave for drawing.'

  aboutChangeACaveButton.appendChild(circle2)
  aboutChangeACaveButton.appendChild(p7)
  aboutChangeACaveButton.appendChild(p8)

  const aboutClearButton = document.createElement('div')
  aboutClearButton.classList.add('AboutClearButton')

  const circle3 = document.createElement('div')
  circle3.classList.add('circle')

  const p9 = document.createElement('p')
  p9.style.fontWeight = '700'
  p9.textContent = 'clear'

  const p10 = document.createElement('p')
  p10.textContent = 'immediately liquidates all workings.'

  aboutClearButton.appendChild(circle3)
  aboutClearButton.appendChild(p9)
  aboutClearButton.appendChild(p10)

  const h2_2 = document.createElement('h2')
  h2_2.textContent = 'physical'
  h2_2.style.gridArea = '1 / 16 / 3 / 18'

  const p11 = document.createElement('p')
  p11.textContent = 'set from sensors allows to control brush settings.'
  p11.style.gridArea = '1 / 18 / 2 / 22'

  const aboutSizeSensor = document.createElement('div')
  aboutSizeSensor.classList.add('AboutSizeSensor')

  const circle4 = document.createElement('div')
  circle4.classList.add('circle')

  const p12 = document.createElement('p')
  p12.style.fontWeight = '700'
  p12.textContent = 'size sensor'

  const p13 = document.createElement('p')
  p13.textContent =
    'allows you to control the size depending on the distance to your hand.'

  aboutSizeSensor.appendChild(circle4)
  aboutSizeSensor.appendChild(p12)
  aboutSizeSensor.appendChild(p13)

  const aboutColorSensor = document.createElement('div')
  aboutColorSensor.classList.add('AboutColorSensor')

  const circle5 = document.createElement('div')
  circle5.classList.add('circle')

  const p14 = document.createElement('p')
  p14.style.fontWeight = '700'
  p14.textContent = 'hardness sensor'

  const p15 = document.createElement('p')
  p15.textContent =
    'reacts to the noise around — the higher the level of noise around, the more hard the brush draws.'

  aboutColorSensor.appendChild(circle5)
  aboutColorSensor.appendChild(p14)
  aboutColorSensor.appendChild(p15)

  const aboutHardnessSensor = document.createElement('div')
  aboutHardnessSensor.classList.add('AboutHardnessSensor')

  const circle6 = document.createElement('div')
  circle6.classList.add('circle')

  const p16 = document.createElement('p')
  p16.style.fontWeight = '700'
  p16.textContent = 'color sensor'

  const p17 = document.createElement('p')
  p17.textContent =
    'must be rotated to change the color of the brush. in the HSB formula, the variable is the first value (x, 0, 0).'

  aboutHardnessSensor.appendChild(circle6)
  aboutHardnessSensor.appendChild(p16)
  aboutHardnessSensor.appendChild(p17)

  const bottomManipulators = document.createElement('div')
  bottomManipulators.classList.add('bottomManipulators')
  bottomManipulators.id = 'bottomManipulators'

  const buttonsSet = document.createElement('div')
  buttonsSet.classList.add('buttonsSet')
  buttonsSet.id = 'buttonsSet'

  const clearButton = document.createElement('div')
  clearButton.classList.add('clearButton')
  clearButton.innerText = 'clear'

  clearButton.addEventListener('click', () => {
    clearCanvas = true
  })

  const changeACaveButton = document.createElement('div')
  changeACaveButton.classList.add('changeACaveButton')
  changeACaveButton.innerText = 'change a cave'

  changeACaveButton.addEventListener('click', () => {
    let newBackgroundImage = imagePaths.at(
      Math.floor(Math.random() * imagePaths.length)
    )
    WorkSpace.style.backgroundImage = `url("${newBackgroundImage}")`
  })

  const saveButton = document.createElement('div')
  saveButton.classList.add('saveButton')
  saveButton.innerText = 'save'

  saveButton.addEventListener('click', () => {
    saveDivAsJPEG()
  })

  const sensorsValues = document.createElement('div')
  sensorsValues.classList.add('sensorsValues')

  const size = document.createElement('h1')
  size.textContent = 'size'
  size.id = 'sizediv'
  sensorsValues.appendChild(size)
  trueSize()

  const hardness = document.createElement('h1')
  hardness.style.transform = 'rotate(6deg)'
  hardness.textContent = 'hardness'
  hardness.id = 'hardnessdiv'
  sensorsValues.appendChild(hardness)
  trueHardness()

  const color = document.createElement('h1')
  color.textContent = 'color'
  color.id = 'colordiv'
  color.style.color = blur
  sensorsValues.appendChild(color)
  trueColor()

  About.appendChild(h3)
  About.appendChild(h4)
  About.appendChild(p1)
  About.appendChild(p2)
  About.appendChild(svg)
  About.appendChild(p3)
  About.appendChild(h2_1)
  About.appendChild(p4)
  About.appendChild(aboutSaveButton)
  About.appendChild(aboutChangeACaveButton)
  About.appendChild(aboutClearButton)
  About.appendChild(h2_2)
  About.appendChild(p11)
  About.appendChild(aboutSizeSensor)
  About.appendChild(aboutColorSensor)
  About.appendChild(aboutHardnessSensor)

  WorkSpace.appendChild(bottomManipulators)
  bottomManipulators.appendChild(buttonsSet)
  buttonsSet.appendChild(clearButton)
  buttonsSet.appendChild(changeACaveButton)
  buttonsSet.appendChild(saveButton)

  bottomManipulators.appendChild(sensorsValues)

  Container.appendChild(About)
  Container.appendChild(WorkSpace)
  document.body.appendChild(Container)
}

document.addEventListener('DOMContentLoaded', () => {
  new p5(sketch, 'WorkSpace')
  renderUI()
})
