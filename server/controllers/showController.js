import axios from "axios"
import Movie from "../models/Movie.js"
import Show from "../models/Show.js";

// Controller function to fetch now playing movies from TMDB API and return them as JSON response.
export const getNowPlayingMovies = async(req, res) => {
    try{
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });
        const movies = data.results;
        res.json({success: true, movies: movies})

    }
    catch(error){
        res.status(500).json({success: false, message: "Error fetching now playing movies"})    
    }
}


// Api to add a new show to the database;
export const addShow = async(req, res) =>{
    try{
        const {movieId, showsInput, showPrice} = req.body;

        if(!movieId || !showsInput || !Array.isArray(showsInput) || !showPrice){
            return res.status(400).json({success: false, message: "Invalid input: movieId, showsInput array, and showPrice are required"});
        }

        let movie = await Movie.findById(movieId);
        if(!movie){
            //Fetch movie details from TMDB API
            const [movieDataResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                })
            ])
            const movieApiData = movieDataResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline | "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,

            }
            // Create a new movie document in the database
            movie = await Movie.create(movieDetails);
             
        }

        // Add the show details to the movie document
        const showsToCreate = [];
        showsInput.forEach((show) => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice: showPrice,
                    occupiedSeats: {}
                })
            })
        })

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }
        res.json({success: true, message: "Show added successfully"})   
    }
    catch(error){
        console.error("Error adding show to the database:", error);
        res.status(500).json({success: false, message: "Error adding show to the database"})
    }
    
}

// Api to get all shows from the database
export const getShows = async(req, res) => {
    try{
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});
        
        //filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie));
        res.json({success: true, shows: Array.from(uniqueShows)});
    }
    catch(error){
        console.error("Error fetching shows from the database:", error);
        res.status(500).json({success: false, message: "Error fetching shows from the database"})
    }
}

// Api to get single show from the database
export const getShow = async(req, res) => {
    try{
        const {movieId} = req.params;
        const shows = await Show.find({movie: movieId, showDateTime: {$gte: new Date()}});

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0];
            if(!dateTime[date]){
                dateTime[date] = [];
            }
            dateTime[date].push({time: show.showDateTime, showId: show._id})
        })

        res.json({success:true, movie, dateTime});
    }
    catch(error){
        console.error("Error fetching single show from the database:", error);
        res.status(500).json({success: false, message: "Error fetching single show from the database"})
    }
}