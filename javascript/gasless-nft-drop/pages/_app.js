import {
  ThirdwebProvider,
  ChainId,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  console.log("RELAY:", process.env.NEXT_PUBLIC_OPENZEPPELIN_URL);
  return (
    <ThirdwebProvider
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL,
          },
        },
      }}
      activeChain={ChainId.Polygon}
      supportedWallets={[
        metamaskWallet({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_CLIENTID,
          recommended: true,
        }),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_CLIENTID,
          recommended: true,
        }),
        coinbaseWallet(),
      ]}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
