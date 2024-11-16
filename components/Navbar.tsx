"use client";

import { Link as LinkScroll } from "react-scroll";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { CiCalendar } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

interface NavLinkProps {
  title: string;
}

const Navbar = () => {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const NavLink = ({ title }: NavLinkProps) => (
    <LinkScroll
      onClick={() => setIsOpen(false)}
      to={title}
      offset={-100}
      spy
      smooth
      activeClass="nav-active"
      className="base-bold text-p4 uppercase transition-all duration-500 cursor-pointer hover:text-p1 hover:scale-105 max-lg:my-4 max-lg:h5"
    >
      {title}
    </LinkScroll>
  );

  return (
    <header
      className={clsx(
        "sticky fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-4",
        hasScrolled && "py-2 bg-black-100/80 backdrop-blur-lg shadow-lg",
      )}
    >
      <div className="container flex h-14 items-center max-lg:px-5">
        <a className="lg:hidden flex-1 cursor-pointer z-2 flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <CiCalendar className="w-8 h-8 text-p1" />
          <span className="text-xl font-semibold text-p1">EVENTFLOW</span>
        </a>

        <div
          className={clsx(
            "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2/90 max-lg:backdrop-blur-md max-lg:opacity-0 transition-all duration-300",
            isOpen ? "max-lg:opacity-100 max-lg:translate-x-0" : "max-lg:pointer-events-none max-lg:translate-x-full",
          )}
        >
          <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                <li className="nav-li">
                  <NavLink title="events" />
                  <div className="dot animate-pulse" />
                  <NavLink title="speakers" />
                </li>

                <li className="nav-logo">
                  <LinkScroll
                    to="hero"
                    offset={-250}
                    spy
                    smooth
                    className={clsx(
                      "max-lg:hidden transition-all duration-300 cursor-pointer flex items-center gap-2 hover:scale-105",
                    )}
                  >
                    <CiCalendar className="w-10 h-10 text-p1" />
                    <span className="text-2xl font-semibold text-p1">EVENTFLOW</span>
                  </LinkScroll>
                </li>

                <li className="nav-li">
                  <NavLink title="tickets" />
                  <div className="dot animate-pulse" />
                  <NavLink title="contact" />
                </li>
              </ul>
            </nav>

            <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90 animate-float">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0 mix-blend-soft-light opacity-5"
              />
            </div>
          </div>
        </div>

        <button
          className="lg:hidden z-2 size-10 border-2 border-s4/25 rounded-full flex justify-center items-center backdrop-blur-sm bg-black-100/30 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          {isOpen ? (
            <IoClose className="w-5 h-5 text-p1" />
          ) : (
            <RxHamburgerMenu className="w-5 h-5 text-p1" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
