import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"



export default function Signup() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChnage = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )
      //

      const data = await res.json()
      // ce console.log vous permet de nvoir les erreurs 
      console.log(data)
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/sign-in")

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>Inscription</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {error && <p className='text-red-500'>{error}</p>}

        <input type="text" placeholder='Nom d utilisateur'
          className='border p-3 rounded-lg' id='username'
          onChange={handleChnage}
        />
        <input type="email" placeholder='Email d utilisateur'
          className='border p-3 rounded-lg' id='email'
          onChange={handleChnage}
        />
        <input type="password" placeholder='Mot de passe d utilisateur'
          className='border p-3 rounded-lg' id='password'
          onChange={handleChnage}
        />
        <input type="password" placeholder='Confirmer le mot de passe'
          className='border p-3 rounded-lg' id='password2'
          onChange={handleChnage}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 uppercase rounded-lg underline-offset-0 hover:opacity-95 disabled:opacity-80'>

          {loading ? "Loading..." : "S'inscrire"}
        </button>


      </form>
      <div className="flex gap-3 mt-5">
        <p><strong>Avez-vous déjà un compte ?</strong></p>
        <Link to={"/sign-in"} className='text-orange-200 '><strong>Se connecter</strong></Link>
      </div>
    </div>
  )
}
