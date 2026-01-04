import './css/App.css';   // <-- Add this
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import SideNav from "./components/SideNav";
import YesterdayStockPerformance from "./screens/YesterdayStockPerformance";
import YesterdayStockMarketNews from "./screens/YesterdayStockMarketNews";
import StockPerformanceDetail from "./screens/StockPerformanceDetail";
import StockGainerLoserDetails from "./screens/StockGainerLoserDetails";
import StockPerformanceByDateRange from "./screens/StockPerformanceByDateRange";

import StockMarketNews from "./screens/StockMarketNews";
import NewsDetail from "./screens/NewsDetail";

import MetricsList from "./screens/MetricsList";
import MetricDetail from "./screens/MetricDetail";
import MetricsByCategory from "./screens/MetricsByCategory";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <SideNav /> */}
      <div className="content-with-sidenav">
        <Routes>
          <Route path="/" element={<YesterdayStockPerformance />} />
          <Route path="/stock-news" element={<YesterdayStockMarketNews />} />
          <Route path="/stock-performance/:id" element={<StockPerformanceDetail />} />
          <Route path="/StockPerformanceList" element={<StockPerformanceByDateRange />} />
          <Route path="/StockGainerLoser" element={<StockGainerLoserDetails />} />
          {/* <Route path="/products" element={<ProductsScreen />} /> */}
          {/* News */}
          <Route path="/StockMarketNews" element={<StockMarketNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          {/* News */}
          <Route path="/MetricsList" element={<MetricsList />} />
          <Route path="/metric-detail/:id" element={<MetricDetail />} />
          <Route path="/MetricsCategory" element={<MetricsByCategory />} />
          
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
