
import { Outlet } from 'react-router-dom'
import vision from '../src/assets/TraceVision.png'
import flower from '../src/assets/flower_no_circle_transparent.png'

function App() {
  
  return (
<article className="relative flex min-h-screen flex-col items-center overflow-x-hidden px-1 py-5 font-primary sm:py-6">
  <img src={vision} alt="Trace Vision" className="w-52 sm:w-60" />

  <Outlet />

  <div className="fixed bottom-0 right-0 w-40 h-36 overflow-hidden pointer-events-none">
    <img
      src={flower}
      alt=""
      className="fixed -bottom-3 -right-8 -rotate-35 w-40 opacity-30"
    />
  </div>

  <div className="fixed bottom-0 left-0 w-40 h-36 overflow-hidden pointer-events-none">
    <img
      src={flower}
      alt=""
      className="fixed -bottom-3 -left-8 rotate-35 w-40 opacity-30"
    />
  </div>
</article>
  )
}

export default App
