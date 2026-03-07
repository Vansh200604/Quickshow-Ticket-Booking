import axios from "axios"

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