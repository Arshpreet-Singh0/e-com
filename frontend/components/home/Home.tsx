import ImageCarousel from './Carousel';
import TopProducts from './TopProducts';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ImageCarousel />

      <TopProducts />
    </div>
  );
}

export default HomePage;