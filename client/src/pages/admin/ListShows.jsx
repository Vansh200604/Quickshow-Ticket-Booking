import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { Currency } from 'lucide-react';
import DateFormat from "/src/lib/DateFormat.js";
import { useAppContext } from '../../context/AppContext';

function ListShows() {
    const currency = import.meta.env.VITE_CURRENCY;

    const {axios, getToken, user} = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try{
            const {data} = await axios.get('/api/admin/all-shows', {
                headers:{
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            setShows(data.shows);
            setLoading(false);
        }
        catch(error){
            console.log("Error fetching shows data ListShows:", error);
        }
        
    }
    useEffect(() => {
        if(user){
            getAllShows();
        }
    }, [user])
    return !loading ? (
        <>
            <Title text1="Admin" text2="ListShows" />

            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/20 text-left text-white'>
                            <th className='p-2 font-medium'>Movie Name</th>
                            <th className='p-2 font-medium'>Show Time</th>
                            <th className='p-2 font-medium'>Total Booking </th>
                            <th className='p-2 font-medium'>Earning</th>
                        </tr>
                    </thead>

                    <tbody >
                        {
                            shows.map((show, index) => (
                                <tr key={index} className=' border-b  border-primary/10 bg-primary/5
                                 even:bg-primary/10'>

                                    <td>{show.movie.title}</td>
                                    <td>{DateFormat(show.showDateTime)}</td>
                                    <td>{Object.keys(show.occupiedSeats || {}).length}</td>
                                    <td>{currency} {Object.keys(show.occupiedSeats || {}).length * show.showPrice}</td>
                                 </tr>

                            ))
                        }
                    </tbody>

                </table>
            </div>
        </>
    ) : (
        <Loading />
    )
}

export default ListShows
