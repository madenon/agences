import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate()
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
       
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        const typeFormUrl = urlParams.get('type');
        const parkingFormUrl = urlParams.get('parking');
        const fornishedFormUrl = urlParams.get('fornished');
        const offerFormUrl = urlParams.get('offer');
        const sortFormUrl = urlParams.get('sort');
        const orderFormUrl = urlParams.get('order');

        if (searchTermFormUrl ||
            typeFormUrl ||
            parkingFormUrl ||
            fornishedFormUrl ||
            offerFormUrl ||
            sortFormUrl ||
            orderFormUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFormUrl || '',
                type: typeFormUrl || 'all',
                parking: parkingFormUrl === 'true' ? true : false,
                furnished: fornishedFormUrl === 'true' ? true : false,
                offer: offerFormUrl === 'true' || 'true' ? true : false,
                sort: sortFormUrl || 'created_at',
                order: orderFormUrl || 'desc'
            });

        }

        const fetchListing = async () => {
            setLoading(true);
            setShowMore(false)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json()
            if(data.length >8){
                setShowMore(true)
            }else{
                setShowMore(false)
            }
            setListings(data);
            setLoading(false)


        };
        fetchListing()

    }, [location.search])





    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({ ...sidebardata, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebardata, [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order })
        }

    };
    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async() =>{
        const numberOfListings = listings.length;
        const startIndex = numberOfListings
        const urlParams = new URLSearchParams(location.search)
        urlParams.set("startIndex",startIndex);
        const searchQuery =urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json()
        if(data.length < 9){
            setShowMore(false)
        }
        setListings([...listings, ...data])

    }



    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-normal font-semibold">Cherchez-vous quelque chose precise ?...</label>
                        <input type="text" id='searchTerm' placeholder='ReCherche🏠 🔑 ❤️‍🔥'
                            className='border rounded-lg p-3 w-full'
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className="font-semibold">Types:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id='all' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === "all"}
                            />
                            <span>Location & Vendre</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                            />
                            <span>Location </span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'} />
                            <span> Vendre</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.offer}
                            />
                            <span>Remise</span>
                        </div>
                    </div>


                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className="font-semibold">Agréments:</label>

                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className='w-5'

                                onChange={handleChange}
                                checked={sidebardata.parking}
                            />
                            <span>Stationnement </span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.furnished}

                            />
                            <span> Meublée</span>
                        </div>

                    </div>


                    <div className="flex items-center gap-2 ">
                        <label className="">Trier par:</label>
                        <select onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id="sort_order"
                            className='border rounded-lg p-3'>
                            <option value="regularPrice_desc">Prix ​​​​du plus  bas</option>
                            <option value="regularPrice_asc">Prix ​​​​plus élévé</option>
                            <option value="createdAt_desc">Dernière</option>
                            <option value="createdAt_asc"> Le plus ancien</option>
                        </select>

                    </div>
                    <button className='bg-slate-700
         text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Recherche
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b mt-5 p-3 text-slate-700'>Résultats de la liste la recherchée </h1>

                <div className="p-7 flex flex-wrap gap-8">
                    {!loading && listings.length === 0 && (
                        <p className='text-xs text-slate-700'>Aucune annonce trouvé</p>
                    )}
                    {loading && (
                        <p
                            className='text-xl text-slate-700 text-center w-full'>Chargement...</p>
                    )}

                    {
                        !loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing} />
                        )
                    }

                    {showMore && (
                        <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center'>
                            Voir plus d'annonce

                        </button>
                    )}
                </div>
            </div>

        </div>
    )
}
