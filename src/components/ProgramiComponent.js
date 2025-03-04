import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Programi = () => {
  const [animate, setAnimate] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // When the component comes into view, set animate to true
  useEffect(() => {
    if (inView) {
      setAnimate(true);
    }
  }, [inView]);

  return (
    <div className='relative  pt-20'>
      <StaticImage
        src='https://res.cloudinary.com/dbssbnuph/image/upload/f_auto,q_auto/v1/karate-ziri-stran/karatemain5_khqjnj'
        alt='Background'
        placeholder='blurred'
        className='fixed inset-0 w-full h-full object-cover'
        style={{
          zIndex: -1,
        }}
      />
      <div className='absolute inset-0 bg-layout1 opacity-75'></div>
      <div className='relative text-text2 font-oswald'>
        <div className='container mx-auto py-10' ref={ref}>
          <div className='flex flex-col items-center justify-center mb-10'>
            <h1 className='text-3xl font-bold text-center'>PROGRAMI</h1>
            <div className='border-b-4 border-identifier w-12 text-center mt-5'></div>
          </div>
          <div
            className={`flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 ${
              animate
                ? 'animate-fade-right animate-duration-1000 animate-delay-200 animate-ease-in-out'
                : ''
            } `}
          >
            <div className='bg-text1 shadow-lg max-w-xs m-5'>
              <Link to='/programi/#otroci'>
                <div className=' h-56 md:h-64 overflow-hidden'>
                  <StaticImage
                    src='https://res.cloudinary.com/dbssbnuph/image/upload/f_auto,q_auto/v1/karate-ziri-stran/karate5_u5rr5y'
                    alt='Kick Boxing Group'
                    className='w-full h-full hover:opacity-50 transition-opacity duration-300 ease-in-out cursor-pointer max-w-96'
                  />
                </div>
              </Link>

              <div className='p-4 flex flex-col'>
                <Link
                  className='text-xl font-semibold mb-2 cursor-pointer text-center items-center'
                  to='/programi/#otroci'
                >
                  Prijazna šola karateja
                </Link>
                <p className='text-identifier mb-4 text-center'>
                  14:00 - 16:00 / Erin Ćoralić
                </p>
                <p className=' text-center'>Otroci od 5 do 12 let</p>
              </div>
            </div>

            <div className='bg-text1 shadow-lg max-w-xs m-5'>
              <Link to='/programi/#mladostniki'>
                <div className=' h-56 md:h-64 overflow-hidden'>
                  <StaticImage
                    src='https://res.cloudinary.com/dbssbnuph/image/upload/f_auto,q_auto/v1/karate-ziri-stran/karatemain2_ezn6en'
                    alt='Kick Boxing Group'
                    className='w-full h-full hover:opacity-50 transition-opacity duration-300 ease-in-out cursor-pointer max-w-96'
                  />
                </div>
              </Link>

              <div className='p-4 flex flex-col'>
                <Link
                  className='text-xl font-semibold mb-2 cursor-pointer text-center items-center'
                  to='/programi/#mladostniki'
                >
                  Karate za mladostnike
                </Link>
                <p className='text-identifier mb-4 text-center'>
                  16:00 - 17:00 / Erin Ćoralić
                </p>
                <p className=' text-center'>Otroci od 12 do 16 let</p>
              </div>
            </div>

            <div className='bg-text1 shadow-lg max-w-xs m-5'>
              <Link to='/programi/#odrasli'>
                <div className='w-full h-56 md:h-64 overflow-hidden'>
                  <StaticImage
                    src='https://res.cloudinary.com/dbssbnuph/image/upload/f_auto,q_auto/v1/karate-ziri-stran/118-1024x680-2_konzps'
                    alt='Traditional Martial Arts'
                    className='w-full h-full hover:opacity-50 transition-opacity duration-500 ease-in-out cursor-pointer max-w-96'
                  />
                </div>
              </Link>

              <div className='p-4 flex flex-col'>
                <Link
                  className='text-xl font-semibold mb-2 cursor-pointer text-center items-center'
                  to='/programi/#odrasli'
                >
                  Karate za odrasle
                </Link>
                <p className='text-identifier mb-4 text-center'>
                  19:30 - 20:30 / Jernej Sever & Benjamin Bajuk
                </p>
                <p className='text-center'>Nadaljevalna in začetna skupina</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programi;
