const SCALE_RATIO = Math.cbrt(Math.sqrt(Math.sqrt(2)))
const SCALE_BASE = 440
const SCALE_FREQUENCIES = frequencies()
const BPM = 360
const BEEP_FREQUENCY_INDEX = 36 // G#5
const BACKGROUND_FREQUENCY_INDEX = 0 // A#2

const startButton = document.getElementById('start')
const gainInput = document.getElementById('gain')
const waveInput = document.getElementById('wave')
const hornButton = document.getElementById('horn')
const backgroundButton = document.getElementById('background')

const bgmContext = new AudioContext() // BGM
const beepContext = new AudioContext() // クラクション
const backgroundContext = new AudioContext() // 背景音

const oscillatorA = bgmContext.createOscillator()
const oscillatorB = bgmContext.createOscillator()
const bgmGainNode = bgmContext.createGain()
const beepOscillator = beepContext.createOscillator()
const beepGainNode = beepContext.createGain()
const backgroundOscillator = backgroundContext.createOscillator()
const backgroundGainNode = backgroundContext.createGain()

oscillatorA.connect(bgmGainNode)
oscillatorB.connect(bgmGainNode)
bgmGainNode.connect(bgmContext.destination)
beepOscillator.connect(beepGainNode)
beepGainNode.connect(beepContext.destination)
backgroundOscillator.connect(backgroundGainNode)
backgroundGainNode.connect(backgroundContext.destination)

oscillatorA.type = waveInput.value
oscillatorA.frequency.value = 440
oscillatorB.type = waveInput.value
oscillatorB.frequency.value = 440
bgmGainNode.gain.value = gainInput.value
beepOscillator.type = 'square'
beepOscillator.frequency.value = SCALE_FREQUENCIES[BEEP_FREQUENCY_INDEX]
beepGainNode.gain.value = gainInput.value
backgroundOscillator.type = 'square'
backgroundOscillator.frequency.value =
    SCALE_FREQUENCIES[BACKGROUND_FREQUENCY_INDEX]
backgroundGainNode.gain.value = gainInput.value

let previousFreqIndexA = 0
let previousFreqIndexB = 0
setInterval(() => {
    let i = previousFreqIndexA
    let j = previousFreqIndexB
    while (i === previousFreqIndexA) {
        i = Math.trunc(Math.random() * (SCALE_FREQUENCIES.length - 1))
    }
    while (j === previousFreqIndexB) {
        j = Math.trunc(Math.random() * (SCALE_FREQUENCIES.length - 1))
    }

    oscillatorA.frequency.value = SCALE_FREQUENCIES[i]
    oscillatorB.frequency.value = SCALE_FREQUENCIES[j]
}, (60 * 1000) / BPM)


// 440 Hz から前後 4 オクターブ分の十二平均律の周波数を生成する
function frequencies() {
    const value = [SCALE_BASE]

    for (let i = 0; i < 24; i += 1) {
        value.push(SCALE_BASE * SCALE_RATIO ** i)
        value.push(SCALE_BASE / SCALE_RATIO ** i)
    }

    value.sort((a, b) => a - b)

    return value
}

let bgmContextStarted = false
startButton.addEventListener('click', () => {
    if (bgmContextStarted) {
        if (bgmContext.state === 'running') {
            bgmContext.suspend()
            startButton.textContent = 'START BGM'
        } else {
            bgmContext.resume()
            startButton.textContent = 'STOP BGM'
        }
    } else {
        bgmContextStarted = true
        oscillatorA.start()
        oscillatorB.start()
        startButton.textContent = 'STOP BGM'
    }
})

gainInput.addEventListener('input', () => {
    bgmGainNode.gain.value = gainInput.value
})

waveInput.addEventListener('input', () => {
    oscillatorA.type = waveInput.value
    oscillatorB.type = waveInput.value
})

let beepContextStarted = false
hornButton.addEventListener('mousedown', () => {
    if (!beepContextStarted) {
        beepOscillator.start()
        beepContextStarted = true
    } else {
        beepContext.resume()
    }
})
hornButton.addEventListener('mouseup', () => {
    beepContext.suspend()
})

let backgroundContextStarted = false
backgroundButton.addEventListener('click', () => {
    if (!backgroundContextStarted) {
        backgroundOscillator.start()
        backgroundContextStarted = true
        backgroundButton.textContent = 'STOP BUS SOUND'
    } else {
        if (backgroundContext.state === 'running') {
            backgroundContext.suspend()
            backgroundButton.textContent = 'START BUS SOUND'
        } else {
            backgroundContext.resume()
            backgroundButton.textContent = 'STOP BUS SOUND'
        }
    }
})
