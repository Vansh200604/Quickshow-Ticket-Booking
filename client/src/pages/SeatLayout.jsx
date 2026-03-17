import React, { useEffect, useState } from 'react'
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, dummyDateTimeData } from '../assets/assets';
import { dummyShowsData } from '../assets/assets';
import Loading from '../components/Loading.jsx';
import isoTimeFormat from '../lib/isoTimeFormat.js';
import BlurCircle from '../components/BlurCircle.jsx';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';


function Seatlayout() {

    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

    const {id, date} = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show, setShow] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    const {axios, getToken, user} = useAppContext();

    const navigate = useNavigate();

    const getShow = async () => {
        try{
            const {data} = await axios.get(`/api/show/${id}`);
            if(data.success){
                setShow(data);
            }
        }
        catch(error){
            console.error("Error fetching show details in SeatLayout.jsx:", error);
        }
    }

    const handleSeatClick = (seatId) => {
        if(!selectedTime){
            return toast("Please select a time first");
        }
        if(!selectedSeats.includes(seatId) && selectedSeats.length >= 5){
            return toast("You can book only 5 seats at a time");
        }
        if(occupiedSeats.includes(seatId)){
            return toast("This seat is already occupied, please select another seat");
        }
        setSelectedSeats(prev => {
            if(prev.includes(seatId)){
                return prev.filter(seat => seat !== seatId);
            }
            else{
                return [...prev, seatId];
            }
        });
    }

    const renderSeats = (row, count = 9) => (
        <div key={row} className='flex gap-2 mt-2'> 
            <div className='flex flex-wrap items-center justify-center gap-2'>
                {Array.from({length:count}, (_, i) => {
                    const seatId = `${row}${i+1}`;
                    return (
                        <button key={seatId} onClick={() => handleSeatClick(seatId)} 
                        className={`h-8 w-8 rounded border border-primary/60 cursor-pointer 
                        ${selectedSeats.includes(seatId) && "bg-primary text-white" } 
                        ${occupiedSeats.includes(seatId) && "opacity-50 cursor-not-allowed"}`}>
                            {seatId}
                        </button>
                    )
                })}
            </div>
        </div>
    )

    const getOccupiedSeats = async () => {
        try{
            const {data} = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
            if(data.success){
                setOccupiedSeats(data.occupiedSeats);
            }
            else{
                toast.error("Error fetching occupied seats", data.message);
            }
        }
        catch(error){
            console.error("Error fetching occupied seats in SeatLayout.jsx:", error);
        }

    }

    const bookTickets = async() => {
        try{
            if(!user){
                return toast("Please login to book tickets.");
            }
            if(selectedSeats.length === 0 || !selectedTime){
                return toast("Please select seats and time to proceed.");
            }
            const {data} = await axios.post('/api/booking/create', {
                showId: selectedTime.showId,
                selectedSeats
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if(data.success){
                window.location.href = data.url;
                toast.success("Tickets booked successfully!", data.message);
                
            }   
            else{
                toast.error(data.message || "Error booking tickets");
            }
        }
        catch(error){
            console.error("Error creating booking in SeatLayout.jsx:", error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getShow();  
    }, [])

    useEffect(() => {
        if(selectedTime){
            getOccupiedSeats();
        }
    }, [selectedTime])

    return show ? (
        <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-30'>

            {/* Avaliable Timings */}
            <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
                <p className='text-lg font-semibold px-6'>Available Timings</p>
                <div className='mt-5 space-y-1'>
                    {show.dateTime[date].map((item) => (
                        <div key={item.time} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
                        ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
                            <ClockIcon className="w-4 h-4 inline mr-2" />
                            <p className='text-sm'>{isoTimeFormat(item.time)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seat Layout */}
            <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
                <BlurCircle top='-100px' left='-100px'/>
                <BlurCircle bottom='0' right='0'/>
                
                <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>

                <img src={assets.screenImage} alt="screen" />
                <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

                <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
                    <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
                        {groupRows[0].map(row => renderSeats(row))}
                    </div>

                    <div className='grid grid-cols-2 gap-11'>
                        {groupRows.slice(1).map((group, index) => (
                            <div key={index}>
                                {group.map(row => renderSeats(row))}
                            </div>
                        ))}
                    </div>

                </div>

                <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary
                 hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer active:scale-95 '>
                    Proceed to Checkout
                    <ArrowRightIcon strokeWidth={3} className='w-4 h-4 inline ml-2'/>
                </button> 

                
            </div>
            
        </div>
    ) : (
        <Loading show={true}/>
    )
}

export default Seatlayout