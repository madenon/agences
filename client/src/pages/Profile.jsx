import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUplodError] = useState(false)
  const [formData, setFormData] = useState({});
  console.log(formData)
  console.log(filePerc)
  console.log(fileUploadError)
  //firebase storage 
  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read;
  //       allow write: if 
  //       request.resource.size < 2 * 1024 * 1024 &&
  //       request.resource.contentType.matches('image/.*')


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


  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl
       font-semibold text-center my-7'>
        Mon Profile
      </h1>
      <form className='flex flex-col gap-4'>

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
              ):( ""
    
  
)}
        </p>

        <input className='border p-3 rounded-lg outline-none'
          type="text" placeholder='Nom utilisateur' id="username" />
        <input className='border p-3 rounded-lg outline-none'
          type="email" placeholder='Email utilisateur' id='email' />

        <input className='border p-3 rounded-lg outline-none'
          type="password" placeholder='Mot de passe' id='password' />
        <input className='border p-3 rounded-lg outline-none'
          type="password" placeholder='Confirmer votre mot de passe' id='password2' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Mettre a jour</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Supprimer le compte</span>
        <span className='text-red-700 cursor-pointer'>Déconnexion</span>
      </div>
    </div>
  )
}
