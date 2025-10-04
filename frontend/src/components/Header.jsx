import React, { useState, useContext } from "react";
import { Vote, Menu, X, LogOut, BarChart3, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";
import ThemeSwitch from "./ThemeSwitch";
import ThemeContext from "@/context/ThemeContext";

const menuItems = [
  { name: "Elections", link: "/elections", icon: Vote },
  { name: "Results", link: "/results", icon: BarChart3 },
  { name: "Users", link: "/users", icon: Users },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    useAuthStore.getState().logout();
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 shadow-lg backdrop-blur-sm border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-200">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  MULTI-ELECT
                </h1>
                <p className="text-xs text-blue-200 -mt-1">Transparent Voting</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.link);
              return (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitch />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => setSignupModalOpen(true)}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-blue-500/20">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.link);
              return (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-blue-500/20 pt-4 space-y-2">
              {user ? (
                <div className="px-4">
                  <p className="text-white font-medium">Welcome, {user.username}</p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 mt-2 px-3 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => {
                      setLoginModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setSignupModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <LoginModal loginModal={loginModalOpen} setLoginModal={setLoginModalOpen} setSignupModal={setSignupModalOpen} />
        <SignupModal signupModal={signupModalOpen} setSignupModal={setSignupModalOpen} setLoginModal={setLoginModalOpen} />
      </div>
    </header>
  );
}

export default Header;