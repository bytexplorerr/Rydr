import React from 'react'
import { assets } from '../assets/assets'

const DownloadApp = () => {
  return (
    <section className='my-4 flex flex-col items-center'>
        <h1 className='mt-2 text-4xl font-semibold max-[500px]:text-3xl max-[425px]:text-2xl'>For Better Experience Dowload</h1>
        <h3 className='text-3xl mt-2 font-bold text-[#8136E2] max-[500px]:text-2xl max-[425px]:text-xl'>Rydr App</h3>
        <div className='flex my-4 gap-8 *:border-2 *:border-[#8136E2] *:rounded-2xl *:cursor-pointer max-sm:flex-col max-sm:gap-4'>
            <img src = {assets.play_store} alt = "Download App from Playstore"
            onClick={()=>window.open("https://play.google.com/store/games?device=windows","_blank")}
            />
            <img src = {assets.app_store} alt = "Download App from Appstore" 
             onClick={()=>window.open("https://www.apple.com/app-store/","_blank")}
            />
        </div>
    </section>
  )
}

export default DownloadApp