// import React, { useState, useEffect } from 'react'
// import Hero from '../components/layout/Hero'
// import CollectionSection from '../components/products/CollectionSection'
// import NewArrivals from '../components/products/NewArrivals'
// import Productdetails from '../components/products/Productdetails'
// import ProductGrid from '../components/products/ProductGrid'
// import { useDispatch } from "react-redux"
// import { fetchProductsByFilters } from '../redux/slices/productSlice'
// import axios from 'axios'
// import { useSelector } from "react-redux";



// // const placeholderProducts =[
// //   {
// //     _id:1,
// //     name:"Product 1",
// //     price:100,
// //     images:[{ url: "https://picsum.photos/500/500?random=3"}],
// // },{
// //   _id:2,
// //   name:"Product 2",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=4"}],
// // },{
// //   _id:3,
// //   name:"Product 3",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=5"}],
// // },
// // {
// //   _id:4,
// //   name:"Product 4",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=6"}],
// // },
// //   {
// //   _id:5,
// //   name:"Product 4",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=7"}]
// // },
// // ,{
// //   _id:6,
// //   name:"Product 5",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=8"}],
// // },{
// //   _id:7,
// //   name:"Product 6",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=9"}],
// // },
// //   {
// //   _id:8,
// //   name:"Product 7",
// //   price:100,
// //   images:[{ url: "https://picsum.photos/500/500?random=10"}]
// // },
// // ]


// const Home = () => {

//   const dispatch = useDispatch()
//   const { products, loading, error } = useSelector((state) => state.products);
//   const [bestSellerProduct, setBestSellerProduct] = useState(null);



//   useEffect(() => {
//     dispatch(fetchProductsByFilters({
//       category: "Pearl",
//       collections: "VintageCharm",
//       rating: 7.5,
//       limit: 8,
//     }))
//     const fetchBestSellerProducts = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
//         const bestSeller = response.data
//         setBestSellerProduct({
//           ...bestSeller,
//           category: bestSeller.category || 'Pearl',
//           collections: bestSeller.collections || 'VintageCharm'
//         })
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchBestSellerProducts()
//   }, [dispatch])
//   return (
//     <div><Hero />
//       <CollectionSection />
//       <NewArrivals />

//       {/* Best Seller */}
//       <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
//       {bestSellerProduct ? (<Productdetails productId={bestSellerProduct._id} />) : (
//         <p>Loading Best Seller Products </p>
//       )}


//       <div className='container mx-auto'>
//         <h2 className='text3xl text-center font-bold mb-4'>
//           SuvarnaRup Best Collection
//         </h2>
//         <ProductGrid products={products} loading={loading} error={error} />
//       </div>
//     </div>
//   )
// }

// export default Home


import React, { useState, useEffect } from 'react'
import Hero from '../components/layout/Hero'
import CollectionSection from '../components/products/CollectionSection'
import NewArrivals from '../components/products/NewArrivals'
import Productdetails from '../components/products/Productdetails'
import ProductGrid from '../components/products/ProductGrid'
import { useDispatch } from "react-redux"
import { fetchProductsByFilters } from '../redux/slices/productSlice'
import axios from 'axios'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// KEEP YOUR COMMENTED CODE AS IS
// const placeholderProducts =[ ... ]

// ❌ REMOVE THESE DUPLICATE IMPORTS
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

const Home = () => {
  const [featured, setFeatured] = useState([]);

  const fetchFeatured = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      setFeatured(response.data);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <section className="relative h-[60vh] bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">SuvarnaRup Collection</h1>
          <p className="mt-3 text-lg">Premium Gold & Silver Jewellery</p>

          <Link to="/products">
            <button className="mt-6 bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={product.img?.[0]?.url || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>

              <p className="text-gray-600">
                ₹{product.discountPrice || product.price}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
