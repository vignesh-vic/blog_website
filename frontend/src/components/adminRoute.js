import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
function AdminRoute() {
    const { currentUser } = useSelector((state) => state.user)
    return (currentUser.isAdmin ? <Outlet /> : <Navigate to='/signin' />)
}

export default AdminRoute
