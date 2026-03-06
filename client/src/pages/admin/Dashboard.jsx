import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import ShowCard from '../../components/admin/ShowCard';

function Dashboard() {
    const currency = import.meta.env.VITE_CURRENCY;
    
    const [dashboardData, setDashboardData] = useState({
        totalBookings:0,
        totalRevenue:0,
        activeShows:[],
        totalUsers:0,
    })

    const [loading, setLoading] = useState(false);
    const dashboardCards = [
        {title: "Total Bookings", value: dashboardData.totalBookings || "0", icon:ChartLineIcon},
        {title: "Total Revenue", value: `${currency} ${dashboardData.totalRevenue || "0"}`, icon: CircleDollarSignIcon },
        {title: "Active Movies", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon},
        {title: "Total Users", value: dashboardData.totalUsers || "0", icon: UserIcon}
    ]
    
    const fetchDashboardData = async () => {
        setDashboardData(dummyDashboardData);
        setLoading(false);
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])

    return !loading ?  (
        <>
            <Title text1="Admin" text2="Dashboard" />

            <div className='relative flex flex-wrap gap-4 mt-6'>
                <BlurCircle top='-100px' left='0px' />

                <div className='flex flex-wrap gap-4 w-full '>
                    {dashboardCards.map((card, index) => (
                        <div key={index} className='flex item-center justify-between px-4  py-3 bg-primary/10 
                        border border-primary/20 rounded-md max-w-50 w-full'>

                            <div>
                                <h1 className='text-sm'>{card.title}</h1>
                                <p className='text-xl font-medium mt-1'>{card.value}</p>
                            </div>
                            <card.icon className='w-6 h-6' />

                        </div>
                    ))}

                </div>

            </div>

            <p className='mt-10 text-lg font-medium'>Active Shows</p>

            <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl '>
                <BlurCircle top='100px' left='-10%' />

                {
                    dummyDashboardData.activeShows.map((show) => (
                        <ShowCard key={show._id} show={show} currency={currency} />
                    ))
                }

            </div>
        </>
    ) : (
        <Loading show={loading} />
    )
}

export default Dashboard
