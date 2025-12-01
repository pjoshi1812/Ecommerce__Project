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
import { API } from '../api/API'


const Home = () => {

  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);



  useEffect(() => {
    dispatch(fetchProductsByFilters({
      category: "Pearl",
      collections: "VintageCharm",
      rating: 7.5,
      limit: 8,
    }))
    const fetchBestSellerProducts = async () => {
      try {
        const response = await API.get("/products/best-seller");
        const bestSeller = response.data
        setBestSellerProduct({
          ...bestSeller,
          category: bestSeller.category || 'Pearl',
          collections: bestSeller.collections || 'VintageCharm'
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchBestSellerProducts()
  }, [dispatch])
  return (
    <div><Hero />
      <CollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      {bestSellerProduct ? (<Productdetails productId={bestSellerProduct._id} />) : (
        <p>Loading Best Seller Products </p>
      )}


      <div className='container mx-auto'>
        <h2 className='text3xl text-center font-bold mb-4'>
          SuvarnaRup Best Collection
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default Home