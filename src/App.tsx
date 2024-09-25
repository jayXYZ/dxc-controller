import React, { useState } from 'react';
import './App.css'
import { socket } from './lib/utils'

function App() {
  const [connected, setConnected] = useState(false)

  socket.on('connect', () => {
    setConnected(true)
  })

  socket.on('disconnect', () => {
    setConnected(false)
  })

  return (
    <h1 className='text-3xl font-bold underline'>
      {connected ? 'Connected' : 'Disconnected'}
    </h1>
  )
}

export default App