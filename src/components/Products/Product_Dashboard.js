import React, { useState, useEffect, useContext, useRef, memo } from 'react';
import { Container, Row, Col, Spinner, Form, Dropdown, Alert } from 'react-bootstrap';
import { CartContext } from '../../context/cartcontext';
import ProductCard from './Product_Card';
import banner_image1 from "../../assets/product/banner_1.png";
import banner_image2 from "../../assets/product/banner_2.png";
import banner_image3 from "../../assets/product/banner_3.png";
import "../../styles/scroll.css";
import { API_URL } from "../../utils/config";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons


const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useContext(CartContext);
  const categoryRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const productContainerRef = useRef(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/getCategories/`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCategories(data);
      setSelectedCategory(data[0]?.id); // Default to the first category
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch Subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/getSubCategories/`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchSubCategories();
  }, []);

  // Filter products by category and search
  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
    }

    if (sortOrder === 'price-asc') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'name-asc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(updatedProducts);
  }, [sortOrder, searchTerm, products, selectedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const scrollProducts = (direction, subCategoryId) => {
    const container = document.getElementById(`product-container-${subCategoryId}`);
    console.log(container);
    const scrollAmount = 260; // Adjust this value as needed

    if (container) {
      if (direction === 'left') {
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
      } else if (direction === 'right') {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };


  const handleScroll = (direction) => {
    const container = productContainerRef.current;
    const scrollAmount = 150; // Adjust this value as needed

    if (container) {
      if (direction === 'left') {
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
      } else if (direction === 'right') {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };
  // To disable arrow buttons at the end or start
  useEffect(() => {
    const checkScroll = () => {
      if (productContainerRef.current) {
        const container = productContainerRef.current;
        setIsAtStart(container.scrollLeft <= 0);
        setIsAtEnd(container.scrollLeft >= container.scrollWidth - container.clientWidth);
      }
    };

    checkScroll(); // Check scroll when component mounts
    window.addEventListener('resize', checkScroll); // Update on window resize

    return () => window.removeEventListener('resize', checkScroll); // Cleanup listener
  }, [filteredProducts]); // Run this effect when products change

  // Event listener to update scroll state
  const handleScrollEvent = () => {
    const container = productContainerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
      setIsAtStart(container.scrollLeft <= 0);
      setIsAtEnd(container.scrollLeft >= container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    const container = productContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScrollEvent);
      }
    };
  }, []);

  return (
    <Container fluid>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {/* Display No Categories Found Message */}
          {categories.length === 0 ? (
            <Alert variant="info" className="text-center">
              No Products Found.
            </Alert>
          ) : (
            <>
              <Row className='mb-2 bg-[#F6F6F6] p-[1%]'>
                <Col className='rounded-sm'>
                  <img src={banner_image1} alt="Banner 1" />
                </Col>
                <Col className='rounded-sm'>
                  <img src={banner_image2} alt="Banner 2" />
                </Col>
                <Col className='rounded-sm'>
                  <img src={banner_image3} alt="Banner 3" />
                </Col>
              </Row>

              {/* Category Scroll */}
              <div className="relative overflow-hidden">
                <div
                  className="flex overflow-x-auto scroll-smooth whitespace-nowrap py-4 px-2 rounded-lg scrollbar-hide"
                  ref={categoryRef}
                >
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className={`inline-block mx-2 cursor-pointer w-[150px] h-[120px] rounded-lg transition-transform transform ${selectedCategory === category.id ? 'translate-y-[-10px]  border-gray-400 shadow-md shadow-teal-300' : ''} flex flex-col items-center justify-center hover:shadow-md hover:shadow-teal-100`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-[84%] h-[64%] mb-2 object-cover rounded-md"
                      />
                      <p className="text-sm text-black break-words text-center">
                        {category.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter and Search */}
              <div className='ml-[2%]'>
                <div className='flex justify-start gap-[2%]'>
                  <Dropdown onSelect={(e) => setSortOrder(e)} >
                    <Dropdown.Toggle className="rounded-full text-sm pt-[10px] pb-[10px] pr-[12px] pl-[12px] bg-[#F3F3F3] text-black border-[0px] font-medium">
                      {sortOrder.startsWith('price') ? `Sort By: ${sortOrder.replace('-', ' ')}` : 'Sort By Price'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="price-asc">Price: Low to High</Dropdown.Item>
                      <Dropdown.Item eventKey="price-desc">Price: High to Low</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown onSelect={(e) => setSortOrder(e)}>
                    <Dropdown.Toggle className="rounded-full text-sm pt-[10px] pb-[10px] pr-[12px] pl-[12px] bg-[#F3F3F3] text-black border-[0px] font-medium">
                      {sortOrder.startsWith('name') ? `Sort By: ${sortOrder.replace('-', ' ')}` : 'Sort By Name'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="name-asc">Name: A to Z</Dropdown.Item>
                      <Dropdown.Item eventKey="name-desc">Name: Z to A</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Form.Control
                    type="text"
                    placeholder="Search Products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 rounded-full text-sm w-[30%] h-10 ml-[45%] bg-[#F3F3F3] text-black"
                  />
                </div>
              </div>

              {/* Subcategories and Products */}
              {subCategories.map(subCategory => (
                <div key={subCategory.id} className="ml-[1.25%] mb-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[34px] font-bold mb-2">{subCategory.name}</h3>
                    <div className="flex items-center">
                      <button
                        onClick={() => scrollProducts('left', subCategory.id)}
                        className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                        disabled={isAtStart}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => scrollProducts('right', subCategory.id)}
                        className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 ml-2"
                        disabled={isAtEnd}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                  {/* Display No Products Found Message */}
                  {filteredProducts.filter(product => product.sub_category === subCategory.id).length === 0 ? (
                    <Alert variant="info" className="text-center">
                      No products found in this category.
                    </Alert>
                  ) : (
                    <div className="relative">
                      <div  id={`product-container-${subCategory.id}`} className="flex overflow-x-auto custom-scrollbar py-2">
                        <div ref={productContainerRef} className="flex gap-[2%]">
                          {filteredProducts
                            .filter(product => product.sub_category === subCategory.id)
                            .map((product) => (
                              <div key={product.id} className="mb-4">
                                <ProductCard product={product} onAddToCart={handleAddToCart} />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default memo(ProductDashboard);
