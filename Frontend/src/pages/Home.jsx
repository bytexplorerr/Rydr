import React from 'react'
import Header from '../components/Header'
import HowItWorks from '../components/HowItWorks'
import DownloadApp from './DownloadApp'
import Driver from '../components/Driver'
import ForCaptains from '../components/ForCaptains'
import Safety from '../components/Safety'

const Home = () => {
  return (
    <>
    <Header />
    <HowItWorks />
    <Driver />
    <ForCaptains />
    <Safety />
    <DownloadApp />
    </>
  )
}

export default Home