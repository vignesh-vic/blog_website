import React from 'react'
import CallToAction from '../components/CallToAction'

function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>
        Projects
      </h1>
      <p className='text-md text-gray-500'>
        The frontend of a MERN stack application is built using React. React’s role is to create an interactive, dynamic user interface and manage the state of the application. It communicates with the backend via HTTP requests (often as RESTful or GraphQL APIs).
      </p>
      <CallToAction />
    </div>
  )
}

export default Projects
