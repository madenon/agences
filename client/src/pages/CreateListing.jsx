import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false)
const [uploading, setUploading] = useState(false)
    const handleImageSubmit = (e) => {
        e.preventDefault()
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls)

                });
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Erreur de téléchargement d image on avaex que 2mb pat image')
                 setUploading(false)
            });
        } else {
            setImageUploadError("Vous pouvez télécharger  que 6 images")
          setUploading(false)
        }

    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        })

    }
    const handleDeleteImage = (index) =>{
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_, i) =>i !== index)
            
        })
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text=3xl font-semibold text-center my-7'>
                Créer  une annonce</h1>

            <form className="flex flex-col sm:flex-row gap-4">
                <div className='flex flex-col  gap-4 flex-1'>
                    <input type="text" placeholder='Nom '
                        className='border p-3 rounded-lg' id='name' maxLength="62" minLength="10" required />

                    <textarea type="text" placeholder='La description'
                        className='border p-3 rounded-lg' id='description' required />

                    <input type="text" placeholder="Adresse de la maison ou l'appartement"
                        className='border p-3 rounded-lg' id='address' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' placeholder='vente' className='w-5' />
                            <span>Vendre</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' placeholder='Louer' className='w-5' />
                            <span>Louer</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' placeholder='Place de stationnement' className='w-5' />
                            <span>Place de stationnement</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furinshed' placeholder='Meublée' className='w-5' />
                            <span>Meublée</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' placeholder='Offre' className='w-5' />
                            <span>Offre</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id='bedrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Lits</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='bedrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Salles de bains</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='regularPrice' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' />

                            <div className="flex flex-col items-center">
                                <p className='text-xs'>Pris par mois</p>
                                <span>(Dirham  / Mois)</span>

                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='discountPrice' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <p>Prix reduire pour des raisons </p>
                                <span className='text-xs'>(Dirham  / Mois)</span>


                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images :
                        <span className='font-normal text-gray-600 ml-2'>La première image sera la couverture (6 au maxium)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} type="file" id='images' accept='images/*' multiple />
                        <button
                        disabled={uploading}
                         type='button' onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-gray-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                                {uploading ? "Téléchargement....": "Téléchargé"}
                            </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (

                        <div key={url}  className="flex justify-between p-3 border items-center">
                   <img src={url} alt="la liste des iamges" className='w-20 h-20  object-contain rounded-lg' />
                   <button type='button' onClick={()=>handleDeleteImage(index)} className=' uppercase p-3 text-red-700 rounded-lg hover:opacity-75'>Supprimer</button>

                        </div>
                    ))
                    }

                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80'>Créer une annonce</button>
                </div>

            </form>
        </main>
    )
}
