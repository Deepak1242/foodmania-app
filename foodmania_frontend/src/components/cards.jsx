import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Cards = () => {
  const navigate = useNavigate();
  const cardsRef = useRef(null);

  useEffect(() => {
    const cards = cardsRef.current.querySelectorAll('.food-card');
    
    gsap.fromTo(cards, 
      { 
        y: 100, 
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const foodCategories = [
    {
      id: 1,
      title: "Street Food",
      description: "Authentic flavors from the streets",
      image: "/img1.png",
      emoji: "🌮",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 2,
      title: "Gourmet Dishes",
      description: "Fine dining at your doorstep",
      image: "/img2.png",
      emoji: "🍽️",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Sweet Treats",
      description: "Desserts to satisfy your cravings",
      image: "/img3.png",
      emoji: "🍰",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: 4,
      title: "Healthy Options",
      description: "Nutritious meals for a balanced lifestyle",
      image: "/img1.png",
      emoji: "🥗",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div ref={cardsRef} className='py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-primary1 to-primary2'>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-main text-amber-400 mb-2 sm:mb-3 md:mb-4">EXPLORE FLAVORS</h2>
          <p className="text-base sm:text-lg md:text-xl text-secondary2 font-fancy">Discover your next favorite meal</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {foodCategories.map((category) => (
            <div
              key={category.id}
              className="food-card group cursor-pointer h-full flex flex-col"
              onClick={() => navigate('/dishes')}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-amber-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                {/* Image */}
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-3xl">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 text-4xl drop-shadow-lg">{category.emoji}</div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 relative z-10 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-main text-amber-300 mb-2 group-hover:text-amber-200 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-secondary2 font-fancy text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="flex items-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-fancy">Explore →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <button 
            onClick={() => navigate('/dishes')}
            className="bg-amber-400 text-primary1 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:bg-amber-300 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/25 text-sm sm:text-base">
            VIEW ALL DISHES
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cards