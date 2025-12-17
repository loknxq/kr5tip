let timers = {}
let lastId = 0

exports.createTimer = (req, res) => {
  const duration = Number(req.body.duration)
  if (!duration || duration <= 0) {
    return res.status(400).json({ error: 'duration must be positive number (seconds)' })
  }

  lastId += 1
  const id = String(lastId)
  const endTime = Date.now() + duration * 1000

  timers[id] = { id, endTime }

  res.status(201).json({ id, endTime })
}

exports.getTimer = (req, res) => {
  const id = req.params.id
  const timer = timers[id]
  if (!timer) {
    return res.status(404).json({ error: 'timer not found' })
  }

  const now = Date.now()
  const remainingMs = timer.endTime - now
  const remaining = remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0

  res.json({ id, remaining })
}

exports.listTimers = (req, res) => {
  const minRemaining = req.query.minRemaining ? Number(req.query.minRemaining) : null
  const now = Date.now()

  let result = Object.values(timers).map(t => {
    const remainingMs = t.endTime - now
    const remaining = remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0
    return { id: t.id, remaining }
  })

  if (minRemaining !== null && !Number.isNaN(minRemaining)) {
    result = result.filter(t => t.remaining >= minRemaining)
  }

  res.json(result)
}

exports.deleteTimer = (req, res) => {
  const id = req.params.id
  if (!timers[id]) {
    return res.status(404).json({ error: 'timer not found' })
  }
  delete timers[id]
  res.status(204).end()
}
