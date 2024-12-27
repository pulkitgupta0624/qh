import React, { useEffect, useState } from "react";
import { FaArrowRight, FaTag, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Make sure to import toast
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import image11 from "../../assets/Front/classicalstarburst.png";
import image22 from "../../assets/Front/starburst.png";
import image33 from "../../assets/Front/solarcandle.png";
import image44 from "../../assets/Front/solarhurricane.jpg";
import image55 from "../../assets/Front/acaciacandle.jpg";
import image66 from "../../assets/Front/eris.png";
import image77 from "../../assets/Front/psyche.png";
import image88 from "../../assets/Front/woodenLantern.jpg"
import image99 from "../../assets/Front/victoria.jpg"
import image101 from "../../assets/Front/aquila.jpg"
import AOS from "aos";
import "aos/dist/aos.css";

// LoadingSpinner component
const LoadingSpinner = () => (
  <FaSpinner className="animate-spin inline-block" />
);

const CandleHolder = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const products = [
    {
      id: "classical-starburst-lanterns",
      name: "THE CLASSICAL STARBURST LANTERNS",
      image: image11,
      originalPrice: 3200,
      discountedPrice: 250,
      imageUrl: "QmbLUyR1qcqNq3kBMHdtPcqN1agYYCWdama9SJHRmJZimY",
    },
    {
      id: "starburst-lanterns",
      name: "STARBURST LANTERNS",
      image: image22,
      originalPrice: 5000,
      discountedPrice: 250,
      imageUrl: "QmVrRBQhHxq6m2jFFEd1bo3iFmt4kbnwHqQSVAxGSBXriB",
    },

    {
      id: "solar-candle-hurricanes",
      name: "SOLAR CANDLE HURRICANES",
      image: image44,
      originalPrice: 4500,
      discountedPrice: 250,
      imageUrl: "QmVuuPg5MaHwsd42rHx5NzdCptPwEZYofWebC4Nrti9Zar",
    },
    {
      id: "acacia-wood-candle-holders",
      name: "ACACIA WOOD CANDLE HOLDERS",
      image: image55,
      originalPrice: 3200,
      discountedPrice: 250,
      imageUrl: "QmUP2ms5adiHJjAMnUMbD2EmAJKipXhyJKHX4SMVQNxYB6",
    },
    {
      id: "eris-marble-candle-holders",
      name: "ERIS MARBLE CANDLE HOLDERS",
      image: image66,
      originalPrice: 2500,
      discountedPrice: 250,
      imageUrl: "Qmf4xXvqhVyLBViqDsf2d6cWLNHbK8zY8Z9hwDvdNHEbns",
    },
    {
      id: "psyche-candle-holders",
      name: "PSYCHE CANDLE HOLDERS",
      image: image77,
      originalPrice: 5000,
      discountedPrice: 250,
      imageUrl: "QmNeMyi1mLQrUkx73ME9djkhRvnJ7XbfsodoQzaoXYpPHY",
    },
    {
      id: "qdore-wooden-lanterns",
      name: "QDORE WOODEN LANTERNS",
      image: image88,
      originalPrice: 5000,
      discountedPrice: 250,
      imageUrl: "QmNeMyi1mLQrUkx73ME9djkhRvnJ7XbfsodoQzaoXYpPHY",
    },
    // {
    //   id: "victoria-floor-lanterns",
    //   name: "VICTORIA FLOOR LANTERNS",
    //   image: image99,
    //   originalPrice: 5000,
    //   discountedPrice: 250,
    //   imageUrl: "QmNeMyi1mLQrUkx73ME9djkhRvnJ7XbfsodoQzaoXYpPHY",
    // },
    // {
    //   id: "aquila-brass-lanters",
    //   name: "AQUILA BRASS LANTERNS",
    //   image: image101,
    //   originalPrice: 5000,
    //   discountedPrice: 250,
    //   imageUrl: "QmNeMyi1mLQrUkx73ME9djkhRvnJ7XbfsodoQzaoXYpPHY",
    // },
  ];

  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data: " + error.message);
      return null;
    }
  };

  const handleAddToCart = async (product) => {
    // Set loading state for this specific product's "Add to Cart" button
    setLoadingStates((prev) => ({
      ...prev,
      [`cart-${product.id}`]: true,
    }));

    try {
      if (!userInfo) {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItem = cartItems.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({
            productId: product.id,
            name: product.name,
            price: Number(product.originalPrice),
            image: `https://ipfs.io/ipfs/${product.imageUrl}`,
            quantity: 1,
          });
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        setActiveProduct(product);
        setModalVisible(true);
        toast.success("Product added to cart!");
        return;
      }

      const token = userInfo?.token;
      if (!token) {
        toast.error("Authentication token is missing.");
        return;
      }

      const userData = await fetchUserData();
      if (!userData || !userData._id) {
        toast.error("Failed to fetch user information.");
        return;
      }

      const mongoUserId = userData._id;
      const response = await fetch(
        "https://qdore-backend-final-final-last.vercel.app/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: mongoUserId,
            productId: product.id,
            name: product.name,
            price: Number(product.originalPrice),
            image: `https://ipfs.io/ipfs/${product.imageUrl}`,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setActiveProduct(product);
      setModalVisible(true);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      // Reset loading state
      setLoadingStates((prev) => ({
        ...prev,
        [`cart-${product.id}`]: false,
      }));
    }
  };

  const handleBuyNow = async (product) => {
    // Set loading state for this specific product's "Buy Now" button
    setLoadingStates((prev) => ({
      ...prev,
      [`buy-${product.id}`]: true,
    }));

    try {
      await handleNavigation(product);
    } finally {
      // Reset loading state
      setLoadingStates((prev) => ({
        ...prev,
        [`buy-${product.id}`]: false,
      }));
    }
  };

  const handleNavigation = (product) => {
    navigate(`/decor/candleDecor/${product.id}`);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <h1 className="text-center text-2xl font-normal font-montserrat mt-4">
        CANDLE HOLDER
      </h1>
      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between"
              data-aos="fade-up"
            >
              <img
                src={product.image}
                onClick={() => handleNavigation(product)}
                alt={product.name}
                className="w-full h-65 object-cover transition-opacity duration-300 hover:opacity-80 cursor-pointer"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <h2 className="text-xl text-center font-light mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-black text-xl">
                      Rs. {product.originalPrice}
                    </span>
                  </div>
                  <FaTag className="text-gray-400" />
                </div>
                <div className="mt-4 flex justify-between gap-4">

                  <button
                    onClick={() => handleBuyNow(product)}
                    disabled={loadingStates[`buy-${product.id}`]}
                    className="bg-black w-1/2 text-white text-sm md:text-lg font-extralight px-1 py-1 transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`buy-${product.id}`] ? (
                      <LoadingSpinner />
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingStates[`cart-${product.id}`]}
                    className="bg-black w-1/2 text-white text-sm md:text-lg font-extralight px-1 py-1 transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`cart-${product.id}`] ? (
                      <LoadingSpinner />
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

      {/* Modal for Product Added Confirmation */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 text-center">
            <h3 className="text-xl font-semibold mb-3">Product Added!</h3>
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              className="w-32 mx-auto mb-3"
            />
            <p>{activeProduct.name} has been added to your cart.</p>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandleHolder;