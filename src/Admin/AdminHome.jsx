import React from 'react'
import LoggedInfo from '../AdminPages/LoggedInfo'

const AdminHome = () => {
    return (
        <div className="container mx-auto py-20 p-8 bg-gradient-to-r from-blue-300 to-indigo-500 bg-cover bg-no-repeat max-w-full min-h-screen">
            <LoggedInfo />
        </div>
    )
}

export default AdminHome