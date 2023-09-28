import {
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const fireblock_address = "0xaD2232fbf866C40a4ce24B95cDd3f867b7A60810";
  const serum_contract = "0x623a1350f6B749575F92Ea54D0F745f9F07D3665";
  const address = useAddress();
  const { contract } = useContract(serum_contract);
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "transfer",
  );
  const { data: balance, isLoading: isLoadingBalance } =
    useBalance(serum_contract);

  if (isLoadingBalance) {
    console.log("Loading Balance...");
  } else {
    console.log("Balance:", JSON.stringify(balance));
  }

  return (
    <div className={styles.container}>
      <div>My wallet address is {address}</div>
      <div>
        SERUM Balance:
        {isLoadingBalance
          ? "Loading..."
          : balance
          ? balance.value.toNumber()
          : "undefined"}
      </div>

      <Web3Button
        contractAddress={serum_contract}
        action={() =>
          mutateAsync({ args: [fireblock_address, balance.value.toString()] })
        }
        onSuccess={() => alert("Transferred!")}
        onError={(error) => {
          console.log("ERROR: ", JSON.stringify(error));
          alert("Something went wrong");
        }}
      >
        Transfer {balance ? balance.displayValue : "..."} SERUM to Fireblocks
      </Web3Button>
    </div>
  );
}
