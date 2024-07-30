import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl
       font-semibold text-center my-7'>
        Mon Profile
      </h1>
      <form className='flex flex-col gap-4' >
        <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center nt-2" src={currentUser.avatar} alt="profile" />
        <input className='border p-3 rounded-lg'
          type="text" placeholder='Nom utilisateur' id="username" />
        <input className='border p-3 rounded-lg'
          type="email" placeholder='Email utilisateur' id='email' />

        <input className='border p-3 rounded-lg'
          type="password" placeholder='Mot de passe'  id='password'/>
             <input className='border p-3 rounded-lg'
          type="password" placeholder='Confirmer votre mot de passe' id='password2' />

<button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Mettre a jour</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Supprimer Votre compte</span>
        <span className='text-red-700 cursor-pointer'>Déconnexion</span>
      </div>
    </div>
  )
}
