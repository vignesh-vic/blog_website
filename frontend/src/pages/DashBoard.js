import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar'
import DashProfile from '../components/DashProfile'
import DashPost from '../components/DashPost'
import DashUsers from '../components/DashUsers'
import DashComment from '../components/DashComment'
import DashBoardComp from '../components/DashBoardComp'
function DashBoard() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }

  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSideBar />
      </div>
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPost />}
      {/*users */}
      {tab === 'users' && <DashUsers />}
      {/*comments */}
      {tab === 'comments' && <DashComment />}
      {/*dashboard com */}
      {tab === 'dash' && <DashBoardComp />}
    </div>
  )
}

export default DashBoard
