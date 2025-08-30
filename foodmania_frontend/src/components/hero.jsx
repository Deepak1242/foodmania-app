import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import {useNavigate} from 'react-router-dom'


gsap.registerPlugin(ScrollTrigger, TextPlugin)

const Hero = () => {

  const navigate = useNavigate()
  const heroRef = useRef(null)
  const frontImageRef = useRef(null)
  const backImageRef = useRef(null)
  const textRef = useRef(null)
  const scrollTextRef = useRef(null)

  // Set initial values
  const images = ['/img1.png', '/img3.png', '/img2.png']
  const titles = ['FLAVOUR', 'SAPORE', '味わい']
  const bgGradients = [
    'linear-gradient(to right, #1e3c72, #2a5298)',
    'linear-gradient(to right, #ff8008, #ffc837)',
    'linear-gradient(to right, #1f4037, #99f2c8)'
  ]
  const textColors = ['#fbbf24', '#ffffff', '#111827']

  useEffect(() => {
    // Set initial image visibility immediately
    if (frontImageRef.current) {
      frontImageRef.current.style.backgroundImage = `url(${images[0]})`;
      frontImageRef.current.style.opacity = '1';
    }
    let ctx = gsap.context(() => {
      // Start the timeline from the second image since we're already showing the first one
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          refreshPriority: -1,
          invalidateOnRefresh: true
        }
      })

      // Start from 1 since we're already showing the first image
      for (let i = 1; i < images.length; i++) {
        tl.set(backImageRef.current, { 
            backgroundImage: `url(${images[i]})`, 
            opacity: 0,
            force3D: true
          })
          .to(backImageRef.current, { 
            opacity: 1, 
            duration: 2,
            ease: 'power2.inOut',
            force3D: true
          })
          .to(frontImageRef.current, { 
            opacity: 0, 
            duration: 2,
            ease: 'power2.inOut',
            force3D: true
          }, '<')
          .set(frontImageRef.current, { 
            backgroundImage: `url(${images[i]})`,
            force3D: true
          })
          .set(backImageRef.current, { 
            opacity: 0,
            force3D: true
          })
          .set(frontImageRef.current, { 
            opacity: 1,
            force3D: true
          })
          .to(textRef.current, {
            text: titles[i],
            color: textColors[i],
            duration: 2,
            ease: 'power2.inOut'
          }, '<')
          .to(heroRef.current, {
            backgroundImage: bgGradients[i],
            duration: 2,
            ease: 'power2.inOut'
          }, '<');

        // Fade out scroll text on last slide
        if (i === images.length - 1) {
          tl.to(scrollTextRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut'
          }, '<+0.8');
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, [])

  return (
    <div
      ref={heroRef}
      className="p-8 flex overflow-hidden relative h-screen hide-scrollbar pt-[14vh] will-change-transform"
      style={{ backgroundImage: 'linear-gradient(to right, #1e3c72, #2a5298)' }}
    >
      {/* Text Content */}
      <div className="w-fit z-10 px-4 md:px-0">
        <div className="text-4xl md:text-6xl lg:text-8xl font-main">
          <h1 className="tracking-widest mx-[1vw] text-amber-400">CONQUER</h1>
          <h1 className="tracking-widest mx-[2vw] md:mx-[6.3vw] text-amber-400">HUNGER</h1>
          <h1 className="tracking-widest mx-[4vw] md:mx-[12.1vw] text-amber-400">RULE THE</h1>
          <h1
            ref={textRef}
            className="tracking-widest mx-[6vw] md:mx-[16.9vw] text-amber-400 transition-colors duration-500"
          >
            FLAVOUR
          </h1>
        </div>

        <div className="text-sm md:text-lg text-secondary2 p-4 md:p-7 mb-4 select-none">
          <h4>🍽️ Welcome to FoodMania — Where Cravings Meet Convenience!</h4>
          <h4 className="mt-2 md:mt-3">Discover a world of delicious flavors delivered straight to your door.</h4>
          <h4 className="mt-2 md:mt-3 hidden md:block">Whether you're in the mood for spicy street food, gourmet meals, or sweet indulgences</h4>
          <h4 className="mt-2 md:mt-3">Fast delivery, endless variety, and food you'll fall in love with — every time. 🔥</h4>

          <button 
          onClick={()=>navigate('/dishes')}
          className="p-3 md:p-4 px-6 md:px-8 border border-amber-300 text-amber-300 mt-4 md:mt-5 hover:ring-2 ring-secondary2 active:scale-75 cursor-pointer shadow-lg shadow-amber-200 transition-transform text-sm md:text-base">
            ORDER NOW!
          </button>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollTextRef}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-80 tracking-widest animate-pulse z-30 font-fancy"
      >
        ↓ Scroll to Explore ↓
      </div>

      {/* Image Layers */}
      <div className="absolute top-[10rem] md:top-[15rem] right-4 md:left-[65%] w-[300px] md:w-[650px] h-[300px] md:h-[650px] z-0">
        <div
          ref={frontImageRef}
          className="absolute inset-0 bg-cover bg-center opacity-100 rounded-full md:rounded-none will-change-transform"
          style={{ 
            transform: 'translateZ(0)',
            backgroundImage: `url(${images[0]})`
          }}
        />
        <div
          ref={backImageRef}
          className="absolute inset-0 bg-cover bg-center opacity-0 rounded-full md:rounded-none will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
    </div>
  )
}

export default Hero
