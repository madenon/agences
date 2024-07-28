import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'

export default function Signin() {
  const [formData, setFormData] = useState({})
 const {loading, error} = useSelector((state)=>state.user)
 // user venant du dossier de user
  const navigate = useNavigate()
  const dispatch = useDispatch()


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
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',
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
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/")

    } catch (error) {
      dispatch(signInFailure(error.message))

    }

  }



  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>Se connecter</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {error && <p className='text-red-500'>{error}</p>}


        <input type="email" placeholder='Email d utilisateur'
          className='border p-3 rounded-lg' id='email'
          onChange={handleChnage}
        />
        <input type="password" placeholder='Mot de passe d utilisateur'
          className='border p-3 rounded-lg' id='password'
          onChange={handleChnage}
        />

        <button disabled={loading} className='bg-slate-700 text-white p-3 uppercase rounded-lg underline-offset-0 hover:opacity-95 disabled:opacity-80'>

          {loading ? "Loading..." : "Se connecter"}
        </button>


      </form>
      <div className="flex gap-3 mt-5">
        <p><strong>Vous n'avez pas  de compte ?</strong></p>
        <Link to={"/sign-up"} className='text-orange-200 '><strong>S'inscrire</strong></Link>
      </div>
    </div>
  )
}
