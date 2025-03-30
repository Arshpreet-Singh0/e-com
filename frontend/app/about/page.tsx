import Image from "next/image";


export default function Page(){
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About DenimCo</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <Image
              src="https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Denim manufacturing"
              className="rounded-lg shadow-lg"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2025, DenimCo has been at the forefront of sustainable denim manufacturing. 
              We believe in creating premium quality jeans while maintaining our commitment to environmental responsibility.
            </p>
            <p className="text-gray-700">
              Our dedication to craftsmanship and innovation has made us a leading name in the denim industry, 
              serving customers worldwide with our unique designs and superior quality products.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-700">Using eco-friendly materials and processes to minimize our environmental impact.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-700">Crafting durable, comfortable jeans that stand the test of time.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700">Constantly evolving our techniques and designs for better products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
