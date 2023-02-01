import NavBar from './components/NavBar';
import ProductCard from './components/ProductCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { fetch_categories, fetch_productByCategory, fetch_products } from './services/product-service';
import { Container, ListGroup } from 'react-bootstrap';
import LoadingPage from './components/LoadingPage';

function App() {
  const [products, setProduct] = useState([]);
  const [categories, setCategory] = useState([]);
  const [current_category, setCurrentCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true)
      const [data_products, data_categories] = await Promise.all([
        fetch_products(),
        fetch_categories()
      ]);
      setProduct(data_products);
      setCategory(data_categories);
      setLoading(false);
    })()
  }, []);
  const fetch_all = async () => {
    try {
      setCurrentCategory('all')
      setLoading(true)
      const res = await fetch_products();
      setProduct(res);
      setLoading(false)

    } catch (error) {
      console.log(error)
    }
  }
  const filter_by_category = async (category) => {
    try {
      setLoading(true)

      const res = await fetch_productByCategory(category);
      setCurrentCategory(category)
      setLoading(false)
      setProduct(res);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>

      <NavBar />
      <div className='d-flex'>
        <div className='d-felx mt-3 align-items-end'>
          <ListGroup>
            <ListGroup.Item style={{ cursor: "pointer" }} onClick={() => fetch_all()} active={current_category === "all"} >All Products</ListGroup.Item>
            {
              React.Children.toArray(categories.map(item => <ListGroup.Item active={current_category === item._id} style={{ cursor: "pointer" }} onClick={() => filter_by_category(item._id)}> {item.name} </ListGroup.Item>))
            }
          </ListGroup>
        </div>
        <Container className='d-flex justify-content-center align-items-center'>
          {
            loading ? <LoadingPage /> :
              (<div className='d-flex flex-wrap justify-content-between'>

                {
                  React.Children.toArray(products.map(item => <ProductCard product={item} />))
                }

              </div>)
          }
        </Container>
      </div>
    </>
  );
}

export default App;
