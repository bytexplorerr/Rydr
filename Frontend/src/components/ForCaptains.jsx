import React from 'react'
import { assets } from '../assets/assets';

const ForCaptains = () => {
  return (
    <section className='my-16'>
        <h1 className='text-4xl font-semibold text-center'>For Captains</h1>
        <aside className='mt-8 grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 *:flex *:flex-col *:items-center *:border-2 *:border-black *:bg-gray-900 *:rounded-2xl max-[401px]:grid-cols-1 mx-2 *:shadow-sm *:shadow-gray-200'>
            <div className='p-2'>
                <img src = {assets.captain_care_1} width="100px" height="100px" className='m-2'/>
                <h1 className='text-2xl font-medium'>Zero Pressure Rides</h1>
                <p className='text-sm font-light mb-2'>Gives a Captain more room in a day without hampering their daily activities. You can decide on when to go on the next ride.</p>
            </div>
            <div className='p-2'>
                <img src = {assets.captain_care_2} width="100px" height="100px" className='m-2'/>
                <h1 className='text-2xl font-medium'>Redeemable Earnings</h1>
                <p className='text-sm font-light mb-2'>What’s the use of getting paid when you can't withdraw money when you want to?Redeems can be transferred from Rapido wallet to your bank account at your convenience.</p>
            </div>
            <div className='p-2'>
                <img src = {assets.captain_care_3} width="100px" height="100px"className='m-2'/>
                <h1 className='text-2xl font-medium'>Insured Rides</h1>
                <p className='text-sm font-light mb-2'>All rides are insured. Accidental coverage and medical benefits covered up to Rs 5 Lakh for Captain & family.</p>
            </div>
        </aside>
    </section>
  )
}

export default ForCaptains