import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const address = useAddress();

  return (
    <div className={styles.container}>
      <div>My wallet address is {address}</div>

      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        modalSize="wide"
        switchToActiveChain={true}
      />
    </div>
  );
}
