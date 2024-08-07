import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from 'swiper/modules';
import SwiperCore from "swiper"
import ListingItem from "../components/ListingItem";


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use(Navigation)
  
  useEffect(() => {
    const fetchOffertListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=6');
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()

      } catch (error) {

        console.log(error)
      }

    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()

      } catch (error) {
        console.log(error)

      }

    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)

      }

    };


   



    fetchOffertListings();

  }, [])

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:' >
          <strong className='capitalize'>Bonjour et bienvenue chez nous.</strong>   <br /> Trouver une chambre , un appartement est parfois difficile <br />c'est dans ce sens nous vous facilitons la taches
          <span className='text-gray-300'>en mettant plusieurs offre par  jours pour vous    </span>       </h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          C'est le meilleur endroit pour trouver votre prochain endroit idéal où vivre
          <br />
          vous disposez d'un large éventail de propriétés parmi lesquelles choisir
        </div>
        <Link to={'/search'} className='sm:text-blue-800 font-bold hover:underline text-2xl'>
          Allez-y commencer à chercher
        </Link>
      </div>
      {/* swiper */}
      <Swiper>
        {offerListings && offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div style={{
                background: `url(${listing.imageUrls[0]})
               center no-repeat`, backgroundSize: "cover"
              }}
                className='h-[500px]' >
              </div>
            </SwiperSlide>
          ))}

      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">

        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Des nouvelles rémises pour vous </h2>
              <Link className='text-sm text-blue-800 hover:underline ' to={'/search?offer=true'}>
               
                <p className='text-center text-bold uppercase text-4xl text-green-800'> Voir plus de rémise</p>
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing_d)=>(
                <ListingItem listing={listing_d}  key={listing_d._id}/>
              ))}

            </div>
          </div>
        )}
       

       {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Des nouvelles annonces de  locations </h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
             
                <p className='text-center text-bold uppercase text-4xl text-green-800'>Voir plus de locations de muebles </p>

              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing_d)=>(
                <ListingItem listing={listing_d}  key={listing_d._id}/>
              ))}

            </div>
          </div>
        )}
       {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Des nouvelles annonces de vendre </h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                <p className='text-center text-bold uppercase text-4xl text-green-800'>Voir plus de vendre de muebles </p>
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing_d)=>(
                <ListingItem listing={listing_d}  key={listing_d._id}/>
              ))}

            </div>
          </div>
        )}
       
        
      </div>

    </div>
  )
}
