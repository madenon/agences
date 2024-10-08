import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user)


    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(true)
                    return;
                }
                setListing(data)
                setLoading(false)

            } catch (error) {
                setError(true)
                setLoading(false)

            }
        }
        fetchListing()

    }, [params.listingId])
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Chargement...</p>}
            {error && <p className='text-center my-7 text-2xl'>Une erreur s'est produite</p>}
            {listing && !loading && !error && (<>
                <Swiper navigation >
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className="h-[550px]  bg-no-repeat	"
                                style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                        Le lien
                    </p>
                )}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name}   --{' '}
                        prix initial  {listing.regularPrice} Fcfa {' Prix à payer '}
                        {
                            +listing.regularPrice - +listing.discountPrice
                        } Fcfa
                        {listing.type === 'rent' && ' / Mois'}

                    </p>
                    <p>Ville :{listing.ville}</p>
                    <p>Quartier :{listing.quartier}</p>

                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'À Louer ' : 'À vendre'}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {+listing.discountPrice} Fcfa Remise /Mois

                            </p>
                        )}
                    </div>
                    <p className='text-slate-800'>
                        <span className='font-semibold text-black'>Description - </span>
                        {listing.description}
                    </p>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg' />
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} chambres `
                                : `${listing.bedrooms} chambre `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} salles de bains `
                                : `${listing.bathrooms} salle de bain `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                            {listing.parking ? 'Stationement ' : 'pas de Stationnement'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg' />
                            {listing.furnished ? 'Meublée' : 'Non meublée  '}
                        </li>
                    </ul>
                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                        <button
                            onClick={() => setContact(true)}
                            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                        >
                            Contacter le  propriétaire de l'annonce
                        </button>
                    )}
                    {contact && <Contact listing={listing} />}
                </div>


            </>
            )}
        </main>
    )
}
