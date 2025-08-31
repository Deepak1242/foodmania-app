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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-yellow-400/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              FoodMania
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium text-sm lg:text-base"
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
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
                  className="relative text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium text-xl"
                  activeClassName="text-yellow-400"
                >
                  <FaShoppingCart />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
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
                  className="px-3 lg:px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all text-sm lg:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="gap-3 flex">
                <button
                  onClick={Loginbtn}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition-all text-sm lg:text-base"
                >
                  Login
                </button>
                <button
                  onClick={Signinbtn}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition-all text-sm lg:text-base"
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
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-64 bg-slate-900 z-50 md:hidden transform translate-x-full"
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                </NavLink>
                {state.user?.role === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className="px-4 py-2 border border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition-all"
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
    </nav>
  );
}

export default Navbar;