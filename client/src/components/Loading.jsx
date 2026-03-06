import React from 'react'

// function Loading() {
//     return (
//         <div className='flex inset-0 justify-center items-center h-[90vh]'>
//             <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-primary'></div>
//         </div>
//     )
// }


// function Loading({ show }) {
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
