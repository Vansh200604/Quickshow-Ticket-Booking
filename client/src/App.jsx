import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/home'
import Seatlayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import Layout from './pages/admin/Layout'
import { SignIn } from '@clerk/clerk-react'
import { useAppContext } from './context/AppContext.jsx'


function App() {
  const location = useLocation();
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  const {user} = useAppContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400)
    return () => clearTimeout(timer);
  }, [location.key]);

  return (
    <>
      <Toaster />
        {<Loading show={loading} />}
        {!isAdminRoute && <NavBar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movies/:id' element={<MovieDetails />} />
          <Route path='/movies/:id/:date' element={<Seatlayout />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/loading/:nextUrl' element={<Loading />} />
          <Route path='/favorite' element={<Favorite />} />

          <Route path='/admin/*' element={ user ? <Layout /> : (
            <div className='min-h-screen flex justify-center items-center'>
              <SignIn fallbackRedirectUrl={'/admin'}/>
            </div>
          )} >
            <Route index element={<Dashboard />} />
            <Route path='add-shows' element={<AddShows />} />
            <Route path='list-shows' element={<ListShows />} />
            <Route path='list-bookings' element={<ListBookings />} />
          </Route>

        </Routes>
        {!isAdminRoute && <Footer />}
      <Toaster />
      

      
    </>
  )
}

export default App
