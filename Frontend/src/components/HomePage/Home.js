import React from 'react'
import Heading from '../Shared/Heading'
import ProductOverview from '../Shared/ProductOverview'
import Testimonials from '../Shared/Testimonials'
import LogoClouds from '../Shared/LogoClouds'
import HeaderSection from '../Shared/HeaderSection'

const HomePage = () => {
    return (
        <>
            <div className="text-center p-10">
            </div>
            <HeaderSection />
            <Heading />
            <ProductOverview />
            <Testimonials />
            <LogoClouds />
        </>
    )
}

export default HomePage