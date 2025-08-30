import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAtom, useAtomValue } from "jotai";
import { loginState, cartTotals } from "../atom/atom.js";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaShoppingCart, FaClipboardList } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [state, setLoginState] = useAtom(loginState);
  const { itemCount } = useAtomValue(cartTotals);
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Loginbtn = () => navigate("/login");
  const Signinbtn = () => navigate("/signup");

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of backend response
      setLoginState({ isLogin: false, user: {}, loading: false });
      localStorage.removeItem('loginState');
      navigate("/");
      closeMenu();
    }
  };

  // Logo animation
  useEffect(() => {
    const text = logoRef.current.querySelector("text");
    const length = text.getComputedTextLength();

    gsap.set(text, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(text, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out",
    })
      .to(
        text,
        {
          fill: "currentColor",
          duration: 1,
          ease: "power1.inOut",
        },
        "+=0.3"
      )
      .to(
        text,
        {
          fill: "transparent",
          strokeDashoffset: length,
          duration: 0.5,
          ease: "power1.inOut",
        },
        "+=1"
      );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { x: "100%", opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dishes", path: "/dishes" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-primary1/30 backdrop-blur-md border-b border-white/20 shadow-md flex items-center justify-between px-[5vw] py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <svg
            ref={logoRef}
            className="w-40 h-14 text-amber-300"
            viewBox="0 0 300 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="35"
              fontSize="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              fontFamily="monospace"
            >
              FoodMania
            </text>
          </svg>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-4 text-secondary2 p-2 mx-[1vw] text-lg font-fancy">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `hover:text-amber-300 transition duration-300 ${
                    isActive
                      ? "text-amber-300 font-semibold underline underline-offset-4"
                      : ""
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {state.isLogin ? (
            <>
              <NavLink 
                to="/orders"
                className="text-amber-300 hover:text-amber-200 text-2xl transition-colors"
                title="My Orders"
              >
                <FaClipboardList />
              </NavLink>
              <NavLink 
                to="/cart"
                className="text-amber-300 hover:text-amber-200 text-2xl transition-colors relative"
                title="View Cart"
              >
                <FaShoppingCart />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              </NavLink>
              {state.user?.role === 'ADMIN' && (
                <NavLink 
                  to="/admin"
                  className="py-2 border-2 bg-purple-600 text-amber-300 border-amber-200 rounded-md px-5 cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-75 transition-transform"
                  title="Admin Dashboard"
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="py-2 border-2 bg-red-500 text-amber-300 border-amber-200 rounded-md px-5 cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-75 transition-transform"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="gap-2 flex">
              <button
                onClick={Loginbtn}
                className="py-2 border-2 text-amber-300 border-amber-200 rounded-md px-5 cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-75 transition-transform"
              >
                Login
              </button>
              <button
                onClick={Signinbtn}
                className="py-2 border-2 text-amber-300 border-amber-200 rounded-md px-5 cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-75 transition-transform"
              >
                Signin
              </button>
              
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-amber-300 text-2xl z-60"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-64 bg-primary1/95 backdrop-blur-lg z-50 md:hidden transform translate-x-full"
      >
        <div className="flex flex-col h-full p-5 pt-20">
          <ul className="flex flex-col space-y-6 text-secondary2 text-lg font-fancy">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-2 hover:text-amber-300 transition duration-300 ${
                      isActive
                        ? "text-amber-300 font-semibold underline underline-offset-4"
                        : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {state.isLogin ? (
              <div className="space-y-4">
                <NavLink 
                  to="/orders"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 py-3 border-2 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-colors"
                >
                  <FaClipboardList />
                  <span>My Orders</span>
                </NavLink>
                <NavLink 
                  to="/cart"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 py-3 border-2 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-colors"
                >
                  <FaShoppingCart />
                  <span>View Cart</span>
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                </NavLink>
                {state.user?.role === 'ADMIN' && (
                  <NavLink 
                    to="/admin"
                    onClick={closeMenu}
                    className="w-full py-3 border-2 bg-purple-600 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-colors text-center"
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 border-2 bg-red-500 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-transform"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="gap-3 flex flex-col">
                <button
                  onClick={() => {
                    closeMenu();
                    Loginbtn();
                  }}
                  className="w-full py-3 border-2 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-transform"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    Signinbtn();
                  }}
                  className="w-full py-3 border-2 text-amber-300 border-amber-200 rounded-md cursor-pointer hover:ring-2 ring-amber-400 shadow-lg transform active:scale-95 transition-transform"
                >
                  Signin
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;