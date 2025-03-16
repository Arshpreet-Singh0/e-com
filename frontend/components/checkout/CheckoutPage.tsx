import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';

const CheckoutPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          
        <AddressForm />
          {/* Order Summary */}
        <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;