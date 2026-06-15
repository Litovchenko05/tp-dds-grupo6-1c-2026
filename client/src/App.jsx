import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './features/home/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './features/layout/Layout.jsx';
// import ProductDetailPage from './features/products/ProductDetailPage.jsx';

function App() {
  return (
  <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="/productos/:id" element={<ProductDetailPage />} /> */}
      </Route>
  </Routes>
  );
}

export default App;
