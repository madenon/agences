import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
<div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
    <form className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
            <label className="whitespace-normal font-semibold">Cherchez-vous quelque chose precise ?...</label>
            <input type="text" id='searchTerm' placeholder='ReCherche🏠 🔑 ❤️‍🔥'
             className='border rounded-lg p-3 w-full '
            />
        </div>
     <div className='flex gap-2 flex-wrap items-center'>
            <label className="font-semibold">Types:</label>
            <div className="flex gap-2">
                <input type="checkbox"  id='all' className='w-5'/>
                <span>Location & Vendre</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox"  id='rent' className='w-5'/>
                <span>Location </span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox"  id='sale' className='w-5'/>
                <span> Vendre</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox"  id='offer' className='w-5'/>
                <span>Remise</span>
            </div>
        </div>


        <div className='flex gap-2 flex-wrap items-center'>
            <label className="font-semibold">Agréments:</label>
           
            <div className="flex gap-2">
                <input type="checkbox"  id='rent' className='w-5'/>
                <span>Stationnement </span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox"  id='furinished' className='w-5'/>
                <span> Meublée</span>
            </div>
            
        </div>


        <div className="flex items-center gap-2 ">
        <label className="">Trier par:</label>
        <select  id="sort_order"
         className='border rounded-lg p-3'>
            <option value="">Prix ​​​​du plus  bas</option>
            <option value="">Prix ​​​​plus élévé</option>
            <option value="">Dernière</option>
            <option value=""> Le plus ancien</option>
        </select>

        </div>
        <button className='bg-slate-700
         text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Recherche
         </button>
    </form>
</div>
<div className="">
    <h1 className='text-3xl font-semibold border-b mt-5 p-3 text-slate-700'>Résultats de la liste la recherchée </h1>
</div>

    </div>
  )
}
