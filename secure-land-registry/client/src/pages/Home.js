import Layout from "../components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

function Home() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-12 bg-blue-100">
        {/* Big welcome card */}
        <Card className="w-full max-w-3xl bg-white shadow-lg p-6 text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-600">
              Welcome to the Secure Land Registry Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700">
            Your one-stop solution for secure, transparent and efficient land transactions using blockchain technology.
          </CardContent>
        </Card>

        {/* Three small feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <Card className="p-4 shadow-md bg-white">
            <CardTitle className="text-lg font-semibold mb-2 justify-self-center">🔗 Decentralized</CardTitle>
            <CardContent className="text-gray-600">
              Eliminates single points of failure with a blockchain-based approach.
            </CardContent>
          </Card>
          <Card className="p-4 shadow-md bg-white">
            <CardTitle className="text-lg font-semibold mb-2 justify-self-center">🔒 Secure</CardTitle>
            <CardContent className="text-gray-600 ">
              Ensures land record authenticity with immutable smart contracts.
            </CardContent>
          </Card>
          <Card className="p-4 shadow-md bg-white">
            <CardTitle className="text-lg font-semibold mb-2 justify-self-center">👁️ Transparent</CardTitle>
            <CardContent className="text-gray-600">
              Enables public ledger visibility, reducing fraudulent transactions.
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
