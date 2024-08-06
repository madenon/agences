import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState("")
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data)

            } catch (error) {
                console.log(error)

            }
        }
        fetchLandlord()

    }, [listing.userRef])

    const handleMessage = (e) => {
        setMessage(e.target.value)

    }
    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>Contacter <span className='font-semibold'>{landlord.username}</span>
                        Pour  <span className='font-semibold'>{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea name="message"
                        id="message" value={message}
                        onChange={handleMessage}
                        rows={2}
                        className=' w-full border p-3 rounded-lg'
                        placeholder="Laisser un message pour l'annonce"

                    ></textarea>
                    <Link to={`mailto:${landlord.email}?subject=voir ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Envoyer le message

                    </Link>

                </div>
            )}
        </>
    )
}
