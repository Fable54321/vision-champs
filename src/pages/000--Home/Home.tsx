
import { Link } from 'react-router-dom'

const Home = () => {
  return (
        <section className="mt-10   flex flex-col w-[min(95%,550px)] items-center gap-1 text-[0.95rem] font-semibold text-center">
      <Link className='bg-linear-to-b from-[#9fd52a] via-primary to-[#5f9408] flex justify-center items-center text-shadow-lg h-20  tracking-[0.08em] rounded-lg   text-white w-full'
       to="/">
      
      <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center  py-7 '>
       <p className='scale-y-220 [text-shadow:1px_1px_1px_#0e224a]'>Esparcimiento de fertilizantes</p>
       </div>

      </Link>

      <Link className='bg-linear-to-b from-[#9fd52a] via-primary to-[#5f9408] flex justify-center items-center text-shadow-lg  h-20 tracking-[0.08em] rounded-lg  text-white w-full'
       to="nueva-cosecha">
       <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center  py-7 '>
       
       <p className='scale-y-220 [text-shadow:1px_1px_1px_#0e224a]' >Nueva cosecha</p>

       </div>
      </Link>
      <Link className='bg-linear-to-b from-[#9fd52a] via-primary to-[#5f9408] flex justify-center items-center text-shadow-lg h-20 tracking-[0.08em] rounded-lg  text-white w-full'
       to="/">
       <div className= 'w-[96%] h-[80%] rounded-lg flex items-center justify-center  py-7 '>
       <p className='scale-y-220 [text-shadow:1px_1px_1px_#0e224a]'>Inspección de la cosecha</p>
</div>
       </Link>

     </section>
  )
}

export default Home
