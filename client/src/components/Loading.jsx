import React, {useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';

// function Loading() {
//   const {nextUrl} = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//       if(nextUrl){
//         setTimeout(() =>{
//           navigate('/' + nextUrl);
//         }, 8000)
//       }
//     }, [])
//     return (
//         <div className='flex inset-0 justify-center items-center h-[90vh]'>
//             <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-primary'></div>
//         </div>
//     )
// }


// function Loading({ show }) {
// const {nextUrl} = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//       if(nextUrl){
//         setTimeout(() =>{
//           navigate('/' + nextUrl);
//         }, 1000)
//       }
//     }, [])
//   return (
//     <div
//       className={`fixed inset-0 flex justify-center items-center z-50 
//       transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//     >
//       <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-primary"></div>
//     </div>
//   )
// }

function Loading({ show }) {
  const {nextUrl} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(nextUrl){
      setTimeout(() =>{
        navigate('/' + nextUrl);
      }, 2000)
    }
  }, [])
  return (
    <div
      className={`fixed inset-0 bg-black flex justify-center items-center z-50 
      transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-primary border-white"></div>
    </div>
  )
}

export default Loading   
