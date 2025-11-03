import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import Home from "@/components/pages/Home";
import ProductPage from "@/components/pages/ProductPage";
import CategoryPage from "@/components/pages/CategoryPage";
import SearchPage from "@/components/pages/SearchPage";
import CheckoutPage from "@/components/pages/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;