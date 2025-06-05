import React from 'react'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import LoginForm from './components/LoginForm'
import ProfileSetup from './components/ProfileSetup'
import ProfileUpdated from './components/ProfileUpdated'
const App = () => {
  const router=createBrowserRouter([
    {
      path:'/',
      element:<LoginForm/>
    },
    {
      path:'/Setup/:id',
      element:<ProfileSetup/>
    },
    {
      path:"/updated",
      element:<ProfileUpdated/>
    }
  ])
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  )
}

export default App;