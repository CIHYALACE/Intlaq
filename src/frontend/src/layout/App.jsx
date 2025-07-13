import { useState } from 'react'
import '../style/App.css'
import { Routes, Route } from 'react-router-dom'
import SharedLayout from '../shared/sharedLayout'
import HomePage from '../pages/homePage'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes >
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  )
}
