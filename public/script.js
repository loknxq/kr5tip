const form = document.getElementById('create-form')
const durationInput = document.getElementById('duration')
const activeBlock = document.getElementById('active-timer')
const timerIdSpan = document.getElementById('timer-id')
const timeRemainingDiv = document.getElementById('time-remaining')
const stopBtn = document.getElementById('stop-btn')

let currentTimerId = null
let intervalId = null

form.addEventListener('submit', async event => {
  event.preventDefault()

  const duration = Number(durationInput.value)
  if (!duration || duration <= 0) {
    return
  }

  const response = await fetch('/api/timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration })
  })

  if (!response.ok) {
    return
  }

  const data = await response.json()
  currentTimerId = data.id
  timerIdSpan.textContent = `#${currentTimerId}`
  activeBlock.classList.remove('hidden')

  if (intervalId) {
    clearInterval(intervalId)
  }
  intervalId = setInterval(updateRemaining, 1000)
  updateRemaining()
})

stopBtn.addEventListener('click', async () => {
  if (!currentTimerId) {
    return
  }
  await fetch(`/api/timer/${currentTimerId}`, { method: 'DELETE' })
  clearInterval(intervalId)
  intervalId = null
  currentTimerId = null
  activeBlock.classList.add('hidden')
  timeRemainingDiv.textContent = '0'
})

async function updateRemaining() {
  if (!currentTimerId) {
    return
  }

  const response = await fetch(`/api/timer/${currentTimerId}`)
  if (!response.ok) {
    clearInterval(intervalId)
    intervalId = null
    currentTimerId = null
    activeBlock.classList.add('hidden')
    return
  }

  const data = await response.json()
  timeRemainingDiv.textContent = String(data.remaining)

  if (data.remaining <= 0) {
    clearInterval(intervalId)
    intervalId = null

    alert('Время вышло')

    currentTimerId = null
    activeBlock.classList.add('hidden')
    timeRemainingDiv.textContent = '0'
  }
}

