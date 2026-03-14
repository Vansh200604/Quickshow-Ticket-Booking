import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {dummyDateTimeData, dummyShowsData} from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import {StarIcon, HeartIcon, PlayCircleIcon} from 'lucide-react';
import TimeFormat from '../lib/TimeFormat.js';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard.jsx';
import Loading from '../components/Loading.jsx';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
 
function MovieDetails() {
    const {id} = useParams();
    const [show, setShow] = useState(null);
    const navigate = useNavigate();
    const {image_base_url} = useAppContext();
    const {shows, axios, user, getToken, fetchFavoriteMovies, favoriteMovies} = useAppContext();

    const getShow = async() => {
        try{
            const {data} = await axios.get(`/api/show/${id}`);
            if(data.success){
                setShow(data);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const handleFavorite = async() => {
        try{
            if(!user){
                toast.error('Please login to add to favorites');
                return;
            }
            const {data} = await axios.post('/api/user/update-favorite', {movieId: id},
                {headers: {Authorization: `Bearer ${await getToken()}`}}
            );
            if(data.success){
                await fetchFavoriteMovies();
                toast.success(data.message);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    
    useEffect(() => {
        getShow();
    }, [id]);

    return show && show.movie ? (
        <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-35'>

            <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>

                <img src={image_base_url + show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 
                object-cover' />

                <div className='relative flex  flex-col gap-3'>
                    <BlurCircle  top='-100px' left='-100px'/>

                    <p className='text-primary mt-3'>ENGLISH</p>
                    <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>

                    <div className='flex items-center gap-2 text-gray-300'>
                        <StarIcon className='w-5 h-5  text-primary fill-primary'/>
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>

                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

                    <p>{TimeFormat(show.movie.runtime)}  .  {show.movie.genres.map(genre => genre.name).join(' | ')} .  {show.movie.release_date.split('-').reverse().join('/')} </p>

                    <div className='flex items-center flex-wrap gap-4 mt-4'>
                        <button className='flex items-center gap-2 px-7 py-3 text-sm gray-800 hover:bg-gray-900 
                        transition rounded-md font-medium cursor-pointer hover:scale-105'>
                            <PlayCircleIcon className='w-5 h-5 '/> 
                            Watch Trailer</button>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                const section = document.getElementById('dateSelect');
                                if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                                }
                                }} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull
                                transition rounded-md font-medium cursor-pointer hover:scale-105'>
                                    Buy Tickets
                            </a>
                        <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer hover:bg-gray-800 hover:scale-95'>
                            <HeartIcon className={`w-5 h-5 hover:scale-105 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary': ''}`}/>
                        </button>
                    </div>

                </div>

            </div>

            <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
            <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
                <div className='flex items-center gap-4 w-max px-4'>
                    {show.movie.casts.slice(0, 12).map((cast, index) => (
                        <div key={index} className='flex flex-col items-center text-center'>
                            <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover '/>
                            <p className='font-medium text-xs mt-3'>{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DateSelect dataTime={show.dateTime} id={id}/>

            <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>

            <div className='flex felx-wrap max-sm:justify-center gap-8'>
                {
                    shows.slice(0,4).map((movie, index) => (
                        <MovieCard key={index} movie={movie} />
                    ))
                }
            </div>

            <div className='flex justify-center mt-20'>
                <button onClick={() => {navigate('/movies'); scrollTo(0, 0)}} className='px-9 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more...</button>
            </div>
            
        </div>
    ) : (
        <Loading />
    )
}

export default MovieDetails
