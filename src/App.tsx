
import { Outlet } from 'react-router-dom'
import vision from '../src/assets/TraceVision.png'
import flower from '../src/assets/flower_no_circle_transparent.png'

function App() {
  
  return (
    <article className="relative flex flex-col items-center py-6 font-primary h-screen">
     <img src={vision} alt="" className="w-60 " />

    <Outlet />

      <img src={flower} alt="" className="absolute -bottom-3 -right-8 -rotate-35 w-40 opacity-30" />
      <img src={flower} alt="" className="absolute -bottom-3 -left-8 rotate-35 w-40 opacity-30" />
    </article>
  )
}

export default App
