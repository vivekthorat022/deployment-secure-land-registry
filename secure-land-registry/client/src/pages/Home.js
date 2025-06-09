import Layout from "../components/Layout";
import { Button } from "../components/ui/button";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-tr from-blue-300 via-blue-100 to-white min-h-[80vh] flex flex-col justify-center items-center text-center px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 drop-shadow-sm leading-tight">
          Secure Land Registry
        </h1>
        <p className="text-lg md:text-xl text-gray-800 mt-4 max-w-2xl">
          A transparent, fraud-proof land registry system powered by Blockchain & Smart Contracts.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => window.location.href = "/login"}>Log In</Button>
          <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-100" onClick={() => window.location.href = "/lands"}>
            View Available Lands
          </Button>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-32 text-blue-400"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,128L60,154.7C120,181,240,235,360,234.7C480,235,600,181,720,160C840,139,960,149,1080,154.7C1200,160,1320,160,1380,160L1440,160V320H0Z" />
        </svg>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
              <p className="text-gray-600">No single point of failure. 100% powered by Ethereum smart contracts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Tamper-Proof</h3>
              <p className="text-gray-600">Records are immutable and traceable on the public ledger.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-semibold mb-2">Transparent</h3>
              <p className="text-gray-600">Track every land listing and transaction history with full visibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-100 to-blue-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="text-4xl font-bold text-blue-600">1</div>
              <p className="text-lg text-gray-700 mt-2 md:mt-0">Register and verify your profile using a secure email login system.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="text-4xl font-bold text-blue-600">2</div>
              <p className="text-lg text-gray-700 mt-2 md:mt-0">List your land with all details and documents for admin approval.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="text-4xl font-bold text-blue-600">3</div>
              <p className="text-lg text-gray-700 mt-2 md:mt-0">Buyers connect with sellers via built-in chat and initiate transactions via MetaMask.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-t from-white to-blue-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to explore verified land listings?</h2>
        <div className="space-x-4">
          <Button onClick={() => window.location.href = "/lands"}>Browse Lands</Button>
          <Button variant="outline" onClick={() => window.location.href = "/register"}>
            Create Account
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
