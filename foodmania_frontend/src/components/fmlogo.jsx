import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FMLogo = () => {
  const logoRef = useRef(null);
  const fRef = useRef(null);
  const mRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    // Initial state
    gsap.set([fRef.current, mRef.current], { 
      opacity: 0, 
      scale: 0.5,
      rotation: -180 
    });

    // Animation sequence
    tl.to(fRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)"
    })
    .to(mRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)"
    }, "-=0.8")
    .to([fRef.current, mRef.current], {
      textShadow: "0 0 20px #fbbf24, 0 0 40px #fbbf24, 0 0 60px #fbbf24",
      duration: 0.5,
      yoyo: true,
      repeat: 1
    }, "+=0.5")
    .to([fRef.current, mRef.current], {
      scale: 0.9,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "+=0.5");

  }, []);

  return (
    <div 
      ref={logoRef}
      className='flex items-center justify-center absolute top-20 right-20 md:top-32 md:right-32 pointer-events-none select-none z-0'
    >
      <h1 
        ref={fRef}
        className='text-amber-400 text-[25vw] md:text-[20vw] lg:text-[15vw] font-main leading-none opacity-20'
      >
        F
      </h1>
      <h1 
        ref={mRef}
        className='text-amber-400 text-[8vw] md:text-[6vw] lg:text-[4vw] font-main leading-none opacity-30 -ml-4'
      >
        M
      </h1>
    </div>
  )
}

export default FMLogo