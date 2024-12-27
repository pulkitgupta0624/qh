import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import image1 from '../../assets/wooden/w1.jpg';
import image2 from '../../assets/wooden/w2.jpg';
import image3 from '../../assets/wooden/w3.jpg';
import image4 from '../../assets/wooden/w4.jpg';
import image5 from '../../assets/wooden/w5.jpg';
import image6 from '../../assets/wooden/w6.jpg';

const products = [
  {
    id: "acacia-wood-candle-holder",
    heading: "ACACIA WOOD CANDLE HOLDER",
    image: image1,
    price: "99.99",
  },
  {
    id: "acacia-wood-side-table",
    heading: "ACACIA WOOD SIDE TABLE",
    image: image2,
    price: "99.99",
  },
  {
    id: "acacia-wood-bowl-i",
    heading: "ACACIA WOOD BOWL-I",
    image: image3,
    price: "99.99",
  },
  {
    id: "acacia-circular-wood-bowl-and-spoon-set",
    heading: "ACACIA CIRCULAR WOOD BOWL & SPOON SET",
    image: image4,
    price: "99.99",
  },
  {
    id: "acacia-wood-bowl-and-serve-set",
    heading: "ACACIA WOOD BOWL & SERVE SET",
    image: image5,
    price: "99.99",
  },
  {
    id: "acacia-wood-bowl-ii",
    heading: "ACACIA WOOD BOWL-II",
    image: image6,
    price: "99.99",
  },
];

const InfinitySlider = ({ products }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [currentX, setCurrentX] = useState(0);
  const animationDuration = 20; // seconds for one complete cycle
  const lastTimeRef = useRef(Date.now());

  const handleClick = (id) => {
    navigate(`/woodenCollection/${id}`);
  };

  const startAnimation = (startX = 0) => {
    lastTimeRef.current = Date.now();
    controls.start({
      x: [`${startX}%`, '-100%'],
      transition: {
        duration: animationDuration * (1 - Math.abs(startX) / 100),
        ease: 'linear',
        repeat: Infinity,
      },
    });
  };

  const handlePause = async () => {
    const currentPosition = await controls.get('x');
    if (typeof currentPosition === 'string') {
      const numericPosition = parseFloat(currentPosition);
      setCurrentX(numericPosition);
    }
    controls.stop();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <div className="w-full overflow-hidden relative">
      <h2 className="text-4xl font-montserrat font-medium mt-10 text-center mb-4">
        WOODEN COLLECTION
      </h2>
      <motion.div
        className="flex items-center space-x-6"
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        dragElastic={0.1}
        onDragStart={handlePause}
        onDragEnd={() => startAnimation(currentX)}
        animate={controls}
        onMouseEnter={handlePause}
        onMouseLeave={() => startAnimation(currentX)}
      >
        {[...products, ...products, ...products, ...products].map((product, index) => (
          <motion.div
            key={index}
            className="relative group cursor-pointer flex-shrink-0"
            onClick={() => handleClick(product.id)}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={product.image}
              alt={`slider-img-${index}`}
              className="w-96 h-120 object-cover rounded-lg"
            />
            <motion.button
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white font-semibold text-lg transition-opacity duration-300"
              whileHover={{ opacity: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(product.id);
              }}
            >
              View Product
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const SliderW = () => {
  return (
    <div className="min-h-5/6 flex items-center justify-center p-4">
      <InfinitySlider products={products} />
    </div>
  );
};
export default SliderW;
