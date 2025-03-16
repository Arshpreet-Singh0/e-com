import ImageCarousel from './Carousel';
import LimitedEdition from './LimitedEdition';
import Newsletter from './Newsletter';
import Sizeguide from './Sizeguide';
import TopProducts from './TopProducts';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ImageCarousel />

      <TopProducts />
      <Sizeguide />
      <LimitedEdition />
      <Newsletter />
    </div>
  );
}

export default HomePage;