import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/hero.jsx"
import Explore from "../components/explore.jsx"
import FMLogo from "../components/fmlogo.jsx"
import Footer from "../components/Footer.jsx"

gsap.registerPlugin(ScrollTrigger);

const Welcome = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={pageRef} className="bg-primary1 min-h-[100vh] min-w-[100vw] hide-scrollbar relative">
      <Navbar />
      <FMLogo />
      <Hero />
      <Explore />
      <Footer />
    </div>
  );
};

export default Welcome;