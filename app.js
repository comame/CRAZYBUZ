const SCALE_RATIO = Math.cbrt(Math.sqrt(Math.sqrt(2)))
const SCALE_BASE = 440
const SCALE_FREQUENCIES = frequencies()
const BPM = 360

const startButton = document.getElementById('start')
const gainInput = document.getElementById('gain')
const bpmInput = document.getElementById('bpm')
const waveInput = document.getElementById('wave')

const context = new AudioContext()

const oscillator = context.createOscillator()
const gainNode = context.createGain()

oscillator.connect(gainNode)
gainNode.connect(context.destination)

oscillator.type = waveInput.value
oscillator.frequency.value = 440
gainNode.gain.value = gainInput.value

let previousFreqIndex = 0
const startInterval = (bpm) =>
    setInterval(() => {
        let i = previousFreqIndex
        while (i === previousFreqIndex) {
            i = Math.trunc(Math.random() * SCALE_FREQUENCIES.length) - 1
        }

        oscillator.frequency.value = SCALE_FREQUENCIES[i]
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
        oscillator.start()
    }
})

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
    oscillator.type = waveInput.value
})
