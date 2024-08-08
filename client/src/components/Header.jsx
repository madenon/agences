import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

export default function Header() {
  const { currentUser } = useSelector(state => state.user)
const [searchTerm, setSearchTerm] = useState("")
const navigate= useNavigate()


const handleSubmit = (e) =>{
  e.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('searchTerm', searchTerm);
  const searchQuery = urlParams.toString();
  navigate(`/search?${searchQuery}`);


}

useEffect(() =>{
  const urlParams =  new URLSearchParams(location.search);
  const searchTermFomuUrl = urlParams.get("searchTerm");
  if(searchTermFomuUrl){
    setSearchTerm(searchTermFomuUrl)
  }
},[location.search])
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className='font-bold text-sm sm:text-xl flex  flex-wrap'>
            <span className='text-slate-500'>Nabini</span>
            <span className='text-slate-700'>Agence</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input type="text" 
          placeholder='Recherche ...' 
          className='bg-transparent focus:outline-none w-24 sm:w-64 max-lg:w-20' 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          
          />
          <button className='text-slate-600'>
          <FaSearch className='text-slate-600' />

          </button>
          {/* A supprimer si le comportement devient bizzare en media scremm  max-lg: */}

        </form>
        <ul className='flex gap-2'>
          <Link to="/"><li className='hidden sm:inline text-slate-700 hover:underline'>Acueil</li>
          </Link>
          <Link to='/about'><li className='capitalize sm:inline text-slate-700 hover:underline overflow-hidden'>à propos</li>
          </Link>
          <Link to="/profile">
            {currentUser ?
              <img className='rounded-full h-7 w-7 object-cover' src= {currentUser.avatar} alt="profile" /> :
              <li className='text-slate-700 hover:underline bg-orange-500 w-32 h-7 rounded-[20px] border-r-2 text-center uppercase'>Se connecter</li>


            }

          </Link>


        </ul>
      </div>

    </header>
  )
}
