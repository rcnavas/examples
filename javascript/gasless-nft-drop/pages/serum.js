import {
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const fireblock_address = "0xaD2232fbf866C40a4ce24B95cDd3f867b7A60810";
  const serum_contract = "0x623a1350f6B749575F92Ea54D0F745f9F07D3665";
  const relay_contract = "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";
  const address = useAddress();
  const { contract } = useContract(serum_contract);
  const {
    mutateAsync: transfer,
    isLoading: isLoadingTransfer,
    error: errorTransfer,
  } = useContractWrite(contract, "transfer");
  const {
    mutateAsync: approve,
    isLoading: isLoadingApprove,
    error: errorApprove,
  } = useContractWrite(contract, "approve");
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    error: errorAllowance,
  } = useContractRead(contract, "allowance", [address, relay_contract]);

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
          ? balance.value.toString()
          : "undefined"}
      </div>
      <div>
        Allowance for {relay_contract}:{" "}
        {isLoadingAllowance
          ? "Loading..."
          : allowance
          ? JSON.stringify(allowance)
          : "undefined"}
      </div>

      <Web3Button
        contractAddress={serum_contract}
        action={() =>
          approve({
            args: [
              relay_contract,
              balance.value.toNumber() > 100 ? 100 : balance.value.toNumber(),
            ],
          })
        }
        onSuccess={(result) => {
          alert("Approved!");
          console.log("Transaction Result: ", JSON.stringify(result));
        }}
        onError={(error) => {
          console.log("Approve ERROR: ", JSON.stringify(error));
          alert("Approve: Something went wrong");
        }}
      >
        Approve{" "}
        {balance
          ? balance.value.toNumber() > 100
            ? 100
            : balance.value.toNumber()
          : "Undefined"}{" "}
        SERUM to relay {relay_contract}
      </Web3Button>

      <Web3Button
        contractAddress={serum_contract}
        action={() =>
          transfer({
            args: [
              fireblock_address,
              balance.value.toNumber() > 100 ? 100 : balance.value.toNumber(),
            ],
          })
        }
        onSuccess={(result) => {
          alert("Transferred!");
          console.log("Transaction Result: ", JSON.stringify(result));
        }}
        onError={(error) => {
          console.log("Transfer ERROR: ", JSON.stringify(error));
          alert("Transfer: Something went wrong");
        }}
      >
        Transfer{" "}
        {balance
          ? balance.value.toNumber() > 100
            ? 100
            : balance.value.toNumber()
          : "Undefined"}{" "}
        SERUM to Fireblocks
      </Web3Button>
    </div>
  );
}
