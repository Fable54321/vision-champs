import { Link } from 'react-router-dom'
import vision from '../src/assets/TraceVision.png'

function App() {
  
  return (
    <article className="flex flex-col items-center py-6 font-primary">
     <img src={vision} alt="" className="w-60 " />

     <section className="mt-10   flex flex-col w-[min(95%,550px)] items-center gap-1 text-[0.95rem] font-semibold text-center">
      <Link className='bg-secondary flex justify-center items-center text-shadow-lg h-20  tracking-[0.08em] rounded-lg   text-white w-full' to="/">
      
      <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center bg-white/15 py-7 '>
       <p className='scale-y-220 [text-shadow:_1px_1px_1px_#0e224a]'>Esparcimiento de fertilizantes</p>
       </div>

      </Link>

      <Link className='bg-secondary flex justify-center items-center text-shadow-lg  h-20 tracking-[0.08em] rounded-lg  text-white w-full' to="/">
       <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center bg-white/15 py-7 '>
       
       <p className='scale-y-220 [text-shadow:_1px_1px_1px_#0e224a]' >Nueva cosecha</p>

       </div>
      </Link>
      <Link className='bg-secondary flex justify-center items-center text-shadow-lg h-20 tracking-[0.08em] rounded-lg  text-white w-full' to="/">
       <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center bg-white/15 py-7 '>
       <p className='scale-y-220 [text-shadow:_1px_1px_1px_#0e224a]'>Inspección de la cosecha</p>
</div>
       </Link>

     </section>
      
    </article>
  )
}

export default App
