import TopProducts from './TopProducts';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative ">
        <div className="h-[600px] w-full bg-cover bg-center" style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1612949677014-47e1623c993b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU5fHxkZW5pbSUyMGplYW5zfGVufDB8fDB8fHww")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-4">Premium Denim Collection</h2>
              <p className="text-xl mb-8">Discover your perfect fit</p>
              <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <TopProducts />
    </div>
  );
}

export default HomePage;