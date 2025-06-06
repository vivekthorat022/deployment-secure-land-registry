import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";

function Home() {
  const { walletAddress, connectWallet } = useContext(WalletContext);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="w-full max-w-md shadow-md rounded-xl bg-white text-black">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            {walletAddress ? (
              <p className="mb-4 text-green-700 text-center">
                ✅ Connected: <strong>{walletAddress}</strong>
              </p>
            ) : (
              <p className="mb-4 text-gray-700 text-center">
                Please connect your MetaMask wallet to continue.
              </p>
            )}
            <Button className="w-full" onClick={connectWallet}>
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default Home;
