import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { Currency } from 'lucide-react';
import DateFormat from "/src/lib/DateFormat.js";

function ListShows() {
    const currency = import.meta.env.VITE_CURRENCY;
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try{
            setShows([
                {
                    movie: dummyShowsData[0],
                    showDateTime:'2026-02-30T02:30:00.000Z',
                    showPrice: 59,
                    occuipiedSeats:{
                        A1: "user_1",
                        B1: "user_2",
                        C1: "user_3"
                    }
                }
            ]);
            setLoading(false);
        }
        catch(error){
            console.log("Error fetching shows data:", error);
        }
        
    }
    useEffect(() => {
        getAllShows();
    }, [])
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
                                    <td>{Object.keys(show.occuipiedSeats).length}</td>
                                    <td>{currency} {Object.keys(show.occuipiedSeats).length * show.showPrice}</td>
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
