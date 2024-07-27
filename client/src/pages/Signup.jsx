import React from 'react'
import {Link}  from "react-router-dom"
export default function Signup() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Inscription</h1>

      <form className='flex flex-col gap-4 '>
        <input type="text" placeholder='Nom d utilisateur'
          className='border p-3 rounded-lg' id='username'
        />
        <input type="email" placeholder='Email d utilisateur'
          className='border p-3 rounded-lg' id='email'
        />
        <input type="password" placeholder='Mot de passe d utilisateur'
          className='border p-3 rounded-lg' id='password'
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg underline-offset-0 hover:opacity-95 disabled:opacity-80'>S'inscrire</button>
      </form>
  <div className="flex gap-3 mt-5">
    <p><strong>Avez-vous déjà un compte ?</strong></p>
    <Link  to={"/sign-in"}  className='text-orange-200'><strong>Se connecter</strong></Link>
  </div>
    </div>
  )
}
