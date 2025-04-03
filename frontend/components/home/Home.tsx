import { Suspense } from 'react';
import ImageCarousel from './Carousel';
import LimitedEdition from './LimitedEdition';
import Newsletter from './Newsletter';
import Sizeguide from './Sizeguide';
import TopProducts from './TopProducts';
import Loading from '../Loading';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ImageCarousel />

      <Suspense fallback={<Loading />}>
      <TopProducts />
      </Suspense>
      <Sizeguide />
      <LimitedEdition />
      <Newsletter />
    </div>
  );
}

export default HomePage;