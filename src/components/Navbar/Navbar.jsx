import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logoImp.png";
import { IoMdSearch } from "react-icons/io";
import { IoCloseOutline } from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaLinkedin, FaAmazon, FaPhoneAlt, FaMapMarkerAlt, FaEnvelopeSquare } from 'react-icons/fa';
import {
  FaCartPlus,
  FaUser,
  FaBars,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import DarkMode from "./DarkMode";
import { useSelector } from "react-redux";
import data from "./data.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";

const Menu = [
  { id: 0, name: "Our Collection", link: "/ourCollection" },
  {
    id: 1,
    name: "Furniture",
    link: "/furniture",
    subMenu: [
      { name: "All", link: "/furniture" },
      { name: "Side Tables", link: "/furniture/side-table" },
      { name: "Coffee Tables", link: "/furniture/coffee-table" },
    ],
  },
  {
    id: 2,
    name: "Home Decor",
    link: "/decor",
    subMenu: [
      { name: "All", link: "/decor" },
      { name: "Candle Holders", link: "/decor/candledecor" },
      { name: "Object Decor", link: "/decor/objectDecor" },
    ],
  },
  { id: 3, name: "Serveware", link: "/servewares" },
  { id: 4, name: "Planters & Vases", link: "/plantersandvases" },
  { id: 5, name: "Our Story", link: "/ourStory" },
  { id: 6, name: "Contact Us", link: "/contactUs" },
  { id: 7, name: "B2B", link: "/b2b" },
];

const changingTexts = [
  "Free Shipping",
  "Sign Up for Exclusive Offers",
  "COD Available",
  "Hassle Free Return & Exchange",
  "5% off on Prepaid Orders"
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // New state for mobile submenu
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const isLoggedIn = !!userInfo;

  const [query, setQuery] = useState("");

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const calculateCartCount = () => {
      // Get local storage cart
      const localStorageCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      console.log(
        "Local Storage Cart:",
        JSON.parse(localStorage.getItem("cartItems") || "[]").length
      );
      if (userInfo) {
        // If user is logged in, fetch database cart count
        const fetchDatabaseCart = async () => {
          try {
            const response = await axios.get(
              `https://qdore-backend-final-final-last.vercel.app/api/cart/count/${userInfo._id}`
            );
            // Combine database cart count with local storage cart length
            const totalCount =
              response.data.itemCount + localStorageCart.length;
            setCartItemCount(totalCount);
          } catch (error) {
            console.error("Error fetching cart item count:", error);
            // Fallback to local storage cart if API call fails
            setCartItemCount(localStorageCart.length);
          }
        };

        fetchDatabaseCart();
      } else {
        // If user is not logged in, use local storage cart length
        setCartItemCount(localStorageCart.length);
      }
    };

    calculateCartCount();
  }, [userInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === changingTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleNavigation = (link) => {
    navigate(link);
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setQuery(input);

    let filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );

    // Add hard-coded search options
    if (input.toLowerCase().includes("table")) {
      filteredData = [
        ...filteredData,
        { id: "table-option", name: "Table", link: "/furniture/side-table" },
        { id: "candle-option", name: "Candle Holder", link: "/decor/candledecor" },
        { id: "object-option", name: "Object Decor", link: "/decor/objectDecor" },
        { id: "serveware-option", name: "Servewares", link: "/servewares" },
        { id: "planter-option", name: "Planter and Vases", link: "/plantersandvases" },
        { id: "wooden-option", name: "Wooden Products", link: "/woodenCollection" },
        { id: "mercury-option", name: "Mercury Products", link: "/mercuryCollection" },
      ];
    }

    setFilteredItems(filteredData);
  };

  const handleItemClick = (id) => {
    if (id === "table-option") {
      navigate("/furniture/side-table");
      return;
    } else if (id === "candle-option") {
      navigate("/decor/candledecor");
      return;
    } else if (id === "object-option") {
      navigate("/decor/objectDecor");
      return;
    } else if (id === "serveware-option") {
      navigate("/servewares");
      return;
    } else if (id === "planter-option") {
      navigate("/plantersandvases");
      return;
    } else if (id === "wooden-option") {
      navigate("/woodenCollection");
      return;
    } else if (id === "mercury-option") {
      navigate("/mercuryCollection");
      return;
    }
    const product = data.find((item) => item.id === id);

    if (product) {
      if (product.id.includes("side")) {
        navigate(`/furniture/side-table/${product.id}`);
      } else if (
        product.id.includes("candle") ||
        product.id.includes("lanterns")
      ) {
        navigate(`/decor/candleDecor/${product.id}`);
      } else if (product.id.includes("mercury")) {
        navigate(`/mercuryCollection/${product.id}`);
      } else if (product.id.includes("globe")) {
        navigate(`/decor/objectDecor/${product.id}`);
      } else if (product.id.includes("serveware")) {
        navigate(`/servewares/${product.id}`);
      } else {
        navigate(`/woodenCollection/${product.id}`);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentTextIndex((prevIndex) =>
      prevIndex === 0 ? changingTexts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentTextIndex((prevIndex) =>
      prevIndex === changingTexts.length - 1 ? 0 : prevIndex + 1
    );
  };


  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  // New function to toggle mobile submenu
  const handleSubMenuToggle = (id) => {
    if (activeSubMenu === id) {
      setActiveSubMenu(null); // Close the submenu if it's already open
    } else {
      setActiveSubMenu(id); // Open the submenu
    }
  };

  const handleClickOutside = (event) => {
    if (
      searchOpen &&
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setFilteredItems([]);
    }
  }, [searchOpen]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searchOpen]);

  const handleClose = () => {
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="sticky top-0 z-10 bg-black dark:bg-black dark:text-white">
      <div className="relative bg-black py-2 text-center text-white text-2xl sm:text-2xl font-roboto flex items-center justify-center space-x-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          className="absolute left-5 text-white hover:text-gray-300 cursor-pointer"
          style={{ zIndex: 10 }}
        >
          <MdKeyboardArrowLeft size={24} />
        </button>

        {/* Text */}
        <p className="text-xl">{changingTexts[currentTextIndex]}</p>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-5 text-white hover:text-gray-300 cursor-pointer"
          style={{ zIndex: 10 }}
        >
          <MdKeyboardArrowRight size={24} />
        </button>
      </div>

      <div className="shadow-md duration-200">
        <div
          className="bg-black py-2 flex items-center justify-between"
          style={{ height: "50px" }}
        >
          <div className="container flex justify-between items-center relative mx-auto px-4">
            <div className="sm:hidden flex items-center justify-between w-full">
              <FaBars
                className="text-white text-2xl z-50 cursor-pointer ml-4"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="fixed inset-0 left-0 top-0 bg-black bg-opacity-30 z-50">
                  <div className="fixed inset-y-0 left-0 bg-white p-4 w-4/5 overflow-y-auto">
                    <div className="flex justify-end">
                      <button
                        className="text-black text-3xl"
                        onClick={() => setMenuOpen(false)}
                      >
                        &times;
                      </button>
                    </div>

                    <div className="flex  mt-6 ">
                      <a
                        onClick={() => handleNavigation("/")}
                        className="font-bold text-2xl sm:text-3xl flex items-center cursor-pointer "
                      >
                        <img
                          src={Logo} // Replace this with the actual path to your logo
                          alt="Logo"
                          className="w-40 h-auto" // Adjust the size as needed
                        />
                      </a>
                    </div>




                    <ul className="flex flex-col items-start gap-4 mt-10 space-y-2">
                      {Menu.map((data) => (
                        <li key={data.id} className="w-full">
                          <div
                            className="text-black text-2xl font-serif flex items-center justify-between w-full cursor-pointer border-b border-gray-300 py-2"
                            onClick={() => {
                              if (data.subMenu) {
                                handleSubMenuToggle(data.id);
                              } else {
                                handleNavigation(data.link);
                              }
                            }}
                          >
                            <span className="font-semibold">{data.name}</span>
                            {data.subMenu && (
                              <FaChevronDown
                                className={`ml-2 z-50 cursor-pointer transition-transform ${activeSubMenu === data.id ? "rotate-180" : ""
                                  }`}
                              />
                            )}
                          </div>

                          {data.subMenu && activeSubMenu === data.id && (
                            <ul className="pl-4 mt-2 w-full">
                              {data.subMenu.map((subItem, index) => (
                                <li key={index} className="w-full">
                                  <a
                                    onClick={() => handleNavigation(subItem.link)}
                                    className="block px-4 py-2 text-xl  text-black font-serif border-b border-gray-200 hover:bg-gray-100"
                                  >
                                    {subItem.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10">
                      <p><br /><br /></p>
                    </div>
                    <div className="flex gap-8 mb-10 mt-10">
                      {/* Social Media Icons */}
                      <div className="relative group">
                        <a
                          href="https://www.facebook.com/profile.php?id=61560626668033&mibextid=LQQJ4d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebookF className="hover:text-gray-400 cursor-pointer text-4xl" />
                        </a>
                        <span className="absolute left-0 bottom-8 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Facebook
                        </span>
                      </div>

                      <div className="relative group">
                        <a
                          href="https://www.instagram.com/qdorehome?igsh=M21uZ3hhb251a2c2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram className="hover:text-gray-400 cursor-pointer text-4xl" />
                        </a>
                        <span className="absolute left-0 bottom-8 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Instagram
                        </span>
                      </div>

                      <div className="relative group">
                        <a
                          href="https://www.linkedin.com/company/qdore-home/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedin className="hover:text-gray-400 cursor-pointer text-4xl" />
                        </a>
                        <span className="absolute left-0 bottom-8 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          LinkedIn
                        </span>
                      </div>

                      <div className="relative group">
                        <a
                          href="https://www.amazon.in/dp/B0DDC5HDTD"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaAmazon className="hover:text-gray-400 cursor-pointer text-4xl" />
                        </a>
                        <span className="absolute left-0 bottom-8 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Amazon
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 " ref={searchContainerRef}>
              <div className="relative group flex items-center">
                <IoMdSearch
                  className="text-white z-50 text-2xl cursor-pointer hover:text-golden-yellow transition-all duration-200"
                  onClick={() => setSearchOpen(true)}
                />

                {/* Search Overlay */}
                <div
                  className={`fixed inset-0 z-50 transition-all duration-300 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                >
                  {/* Blur Background */}
                  <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={handleClose}
                  />

                  {/* Search Container */}
                  <div className="relative w-full h-full flex items-start justify-center pt-20 px-4">
                    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                      {/* Search Input */}
                      <div className="relative flex items-center p-4">
                        <IoMdSearch className="text-gray-400 text-2xl" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={query}
                          onChange={handleSearch}
                          placeholder="Search..."
                          className="w-full px-4 py-2 text-lg font-roboto focus:outline-none dark:bg-gray-800 dark:text-white"
                        />
                        <IoCloseOutline
                          className="text-gray-400 text-2xl cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                          onClick={handleClose}
                        />
                      </div>

                      {/* Search Results */}
                      {filteredItems.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <ul className="max-h-96 overflow-y-auto">
                            {filteredItems.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  handleItemClick(item.id);
                                  handleClose();
                                }}
                                className="px-6 py-3 text-sm border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <div
                className={`flex justify-center absolute inset-x-0 mx-auto transition-all duration-300 ${searchOpen ? "transform -translate-x-20 sm:translate-x-0" : ""
                  }`}
              >
                <a
                  onClick={() => handleNavigation("/")}
                  className="font-bold text-2xl sm:text-3xl flex items-center cursor-pointer"
                >
                  <img
                    src={Logo}
                    alt="Logo"
                    className="drop-shadow-lg"
                    style={{ height: "30px", width: "auto" }}
                  />
                </a>
              </div>


              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigation("/cart")}
                  className="bg-gradient-to-r from-golden-yellow to-golden-orange transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
                >
                  <FaCartPlus className="text-2xl text-white drop-shadow-sm cursor-pointer" />
                  {(userInfo || cartItemCount > 0) && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleProfileClick}
                  className="text-white transition-all duration-200 py-1 px-4 rounded-full flex items-center gap-3 group"
                >
                  {isLoggedIn ? (
                    <FaUserCircle className="text-xl drop-shadow-sm cursor-pointer" />
                  ) : (
                    <FaUser className="text-xl drop-shadow-sm cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white flex justify-center p-2 sm:p-0">
            <ul className="sm:flex hidden items-center gap-3">
              {Menu.map((data) => (
                <li
                  key={data.id}
                  className={`relative group ${data.subMenu ? "hover:bg-gray-100" : ""
                    }`}
                  onMouseEnter={() => data.subMenu && setActiveDropdown(data.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    onClick={() => !data.subMenu && handleNavigation(data.link)}
                    className="inline-block px-4 text-black text-2xl font-roboto relative cursor-pointer transform transition-transform hover:scale-105 flex items-center"
                  >
                    {data.name}
                  </a>
                  {data.subMenu && activeDropdown === data.id && (
                    <ul className="absolute bg-white shadow-lg rounded-lg top-full w-40 left-0">
                      {data.subMenu.map((subItem, index) => (
                        <li key={index} className="hover:bg-gray-200">
                          <a
                            onClick={() => handleNavigation(subItem.link)}
                            className="block px-4 py-2 text-black hover:text-golden-yellow duration-200 text-base font-roboto"
                          >
                            {subItem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Menu (Shifted Bar Button to Left) */}

          </div>
        </div>
      </div>
      );
};

      export default Navbar;