import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        ville: '',
        quartier: '',
        description: '',
        address: '',
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,

    });

    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    console.log(formData)
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
                setImageUploadError('Erreur de téléchargement d image')
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
    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)

        })
    }

    const handleChnage = (e) => {
        if (e.target.id === 'sale' || e.target.id === "rent") {
            setFormData({
                ...formData, type: e.target.id
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === "offer") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })

        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
    }
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError("Vous devez téléchargé  une image");
            if (+formData.regularPrice < +formData.discountPrice) return setError("Le  prix à payer par mois  doit pas etre supérieur aux prix réduit ");
            setLoading(true);
            setError(false)
            const res = await fetch("/api/listing/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }
                )
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message)

            }

            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message)
            setLoading(false)

        }
    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-4'>
                Créer  une annonce</h1>

            <form onSubmit={handleSubmitForm} className="flex flex-col sm:flex-row gap-2">
                <div className='flex flex-col  gap-2 flex-1'>
                    <input type="text" placeholder='Nom '
                        className='border p-3 rounded-lg' id='name' maxLength="62" minLength="10" required onChange={handleChnage} value={formData.name} />

                    <textarea type="text" placeholder='La description'

                        className='border p-3 rounded-lg' id='description' required onChange={handleChnage} value={formData.description} />

                    <input type="text" placeholder="Adresse de la maison ou l'appartement"
                        className='border p-3 rounded-lg' id='address' required onChange={handleChnage} value={formData.address} />


                    <input type="text" placeholder="La ville la où l'offre est disponible"
                        className='border p-3 rounded-lg' id='ville' required onChange={handleChnage} value={formData.ville} />


                    <input type="text" placeholder="Le quartier la oùl'offre est disponible"
                        className='border p-3 rounded-lg' id='quartier' required onChange={handleChnage} value={formData.quartier} />


                    <div className="flex gap-6 flex-wrap">

                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' placeholder='vente' className='w-5' onChange={handleChnage} checked={formData.type === "sale"} />
                            <span className='capitalize'> à Vendre</span>
                        </div>





                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' placeholder='Louer' className='w-5' onChange={handleChnage} checked={formData.type === 'rent'} />
                            <span>Louer</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' placeholder='Place de stationnement' className='w-5' onChange={handleChnage} checked={formData.parking} />
                            <span>Place de stationnement</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' placeholder='Meublée' className='w-5' onChange={handleChnage} checked={formData.furnished} />
                            <span>Meublée</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' placeholder='Remise' className='w-5' onChange={handleChnage} checked={formData.offer} />
                            <span>Remise</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id='bedrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' onChange={handleChnage} value={formData.bedrooms} />
                            <p>Chambres</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="number" id='bathrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg' onChange={handleChnage} value={formData.bathrooms} />
                            <p>Salles de bains</p>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <input type="number" id='regularPrice' min="300" max="500000" required className='p-3 border border-gray-300 rounded-lg' onChange={handleChnage} value={formData.regularPrice} />

                            <div className="flex flex-col items-center">
                                <p className='text-xs'>Pris par mois</p>
                                <span>(Fcfa  / Mois)</span>

                            </div>
                        </div>
                        {formData.offer && <div className="flex flex-col items-center gap-2">
                            <input type="number" id='discountPrice' min="50" max="500" required className='p-3 border border-gray-300 rounded-lg' onChange={handleChnage} value={formData.discountPrice} />
                            <div className="flex flex-col items-center">
                                <p>Prix ​​rémise  poar mois </p>
                                <span className='text-xs'>(Fcfa  / Mois)</span>


                            </div>
                        </div>}


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
                            {uploading ? "Téléchargement...." : "Téléchargé"}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (

                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="la liste des iamges" className='w-20 h-20  object-contain rounded-lg' />
                            <button type='button' onClick={() => handleDeleteImage(index)} className=' uppercase p-3 text-red-700 rounded-lg hover:opacity-75'>Supprimer</button>

                        </div>
                    ))
                    }

                    <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80'>
                        {loading ? "Création..." : " Créer une annonce"}
                    </button>
                    {error && <p className='text-red-700'>{error}</p>}
                </div>

            </form>
        </main>
    )
}
