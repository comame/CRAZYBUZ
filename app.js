const SCALE_RATIO = Math.cbrt(Math.sqrt(Math.sqrt(2)))
const SCALE_BASE = 440
const SCALE_FREQUENCIES = frequencies()
const BPM = 360

const startButton = document.getElementById('start')
const gainInput = document.getElementById('gain')
const bpmInput = document.getElementById('bpm')
const waveInput = document.getElementById('wave')

const context = new AudioContext()

const oscillatorA = context.createOscillator()
const oscillatorB = context.createOscillator()
const gainNode = context.createGain()

oscillatorA.connect(gainNode)
oscillatorB.connect(gainNode)
gainNode.connect(context.destination)

oscillatorA.type = waveInput.value
oscillatorA.frequency.value = 440
oscillatorB.type = waveInput.value
oscillatorB.frequency.value = 440
gainNode.gain.value = gainInput.value

let previousFreqIndexA = 0
let previousFreqIndexB = 0
const startInterval = (bpm) =>
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
    }, (60 * 1000) / bpm)

let intervalId = startInterval(BPM)

let started = false
startButton.addEventListener('click', () => {
    if (started) {
        if (context.state === 'running') {
            context.suspend()
        } else {
            context.resume()
        }
    } else {
        started = true
        oscillatorA.start()
        oscillatorB.start()
    }
})

// 440 Hz から前後 4 オクターブ分の十二平均律の周波数を生成する
function frequencies() {
    const value = [SCALE_BASE]

    for (let i = 0; i < 24; i += 1) {
        value.push(SCALE_BASE * SCALE_RATIO ** i)
        value.push(SCALE_BASE / SCALE_RATIO ** i)
    }

    return value
}

gainInput.addEventListener('input', () => {
    gainNode.gain.value = gainInput.value
})

bpmInput.addEventListener('input', () => {
    clearInterval(intervalId)
    intervalId = startInterval(bpmInput.value)
})

waveInput.addEventListener('input', () => {
    oscillatorA.type = waveInput.value
    oscillatorB.type = waveInput.value
})
