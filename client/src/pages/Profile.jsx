import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure,
   deleteUserFailure, deleteUserStart, deleteUserSUccess, logoutUserStart,
    logoutUserSUccess, logoutUserFailure } from '../redux/user/userSlice'
import { Link } from "react-router-dom"
export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUplodError] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()
       request.resource.contentType.matches('image/.*')


  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
// Les revisions 
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    },
      (error) => {
        setFileUplodError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })

        });
      },
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })


  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)


    } catch (error) {
      dispatch(updateUserFailure(error.message));

    }


  }


  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      };
      dispatch(deleteUserSUccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));

    }

  }


  const handleSignOut = async () => {
    try {
      dispatch(logoutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message))
        return;
      }
      dispatch(logoutUserSUccess(data))
    } catch (error) {
      dispatch(logoutUserFailure(data.message))

    }

  }

  const handelShowListing = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true)
        return
      }

      setUserListings(data)

    } catch (error) {
      setShowListingError(true)

    }

  }

  const handleListingDelete = async(listingId) =>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method:"DELETE",
      })

      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      

      setUserListings((prev )=>
        prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message)
      
    }

  }

  
  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl
       font-semibold text-center my-7'>
        Mon Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept='image/*' />

        <img onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center nt-2"
          src={formData.avatar || currentUser.avatar} alt="profile" />



        <p className='text-sm self-center'>

          {fileUploadError ?
            (<span className='text-red-700'>Erruer de telechargmenet</span>) :
            filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${filePerc}%`}
              </span>)
              :
              filePerc === 100 ? (
                <span className='text-green-700'>Téléchargement réussi</span>
              ) : (""


              )}
        </p>

        <input className='border p-3 rounded-lg outline-none'
          type="text" placeholder='Nom utilisateur' id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input className='border p-3 rounded-lg outline-none'
          type="email" placeholder='Email utilisateur' id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <input className='border p-3 rounded-lg outline-none'
          type="password" placeholder='Mot de passe' id='password' />
        {/* <input className='border p-3 rounded-lg outline-none'
          type="password" placeholder='Confirmer votre mot de passe' id='password2' /> */}

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
          {loading ? 'Loading' : "Mettre à jour vos informations"}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to="/create-listing">Créer une annonce</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Supprimer le compte</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Déconnexion</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "Les données de lutilisateur à bien été mis à jour avec succès" : ""}</p>

      <button onClick={handelShowListing} className='text-green-700 w-full capitalize '>Afficher la liste des annonces
      </button>
      <p className='text-red-700 mt-5'>{showListingError ? "Erreur lors de l'affichage des annonces" : ""}</p>

      {userListings && userListings.length > 0 &&

 <div className=" flex flex-col gap-4">
  <h1 className='text-center  mt-7 text-2xl font-semibold capitalize'>Ma liste des annonces </h1>
       { userListings.map((listing) => <div key={listing._id}>
          <div className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link>
              <img className='h-16 w-16 object-contain rounded-lg'
                src={listing.imageUrls} alt="L'adresse de l'image" />

            </Link>
            <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div
              className=" flex flex-col items-center gap-3  ">
              <button  onClick={()=>handleListingDelete( listing._id)} className='text-red-700 uppercase'>Supprimer</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700 uppercase'>Modifier</button>
              </Link>
            </div>
          </div>

        </div>



        )}

        </div>}
    </div>
  )
}
