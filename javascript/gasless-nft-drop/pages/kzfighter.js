import {
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useOwnedNFTs,
  useNFTs,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
//import kzfighter_abi from "../lib/KZFighterABI.json";

export default function Home() {
  const fireblock_address = "0xaD2232fbf866C40a4ce24B95cDd3f867b7A60810";
  const kzfighter_contract = "0x60ce73cF71Def773a7a8199D4e6B2F237D5a6b32";
  const address = useAddress();
  const {
    contract,
    isLoading: isLoadingContract,
    error: errorContract,
  } = useContract(kzfighter_contract);
  //console.log("ABI:", JSON.stringify(kzfighter_abi));

  const {
    data: nfts,
    isLoading: isLoadingNfts,
    error: errorNfts,
  } = useNFTs(contract);

  if (isLoadingContract) {
    console.log("Loading Contract...");
  } else {
    if (errorContract) {
      console.log("Contract Error: ", errorContract);
    } else {
      console.log("Contract:", contract);
    }
  }
  if (isLoadingNfts) {
    console.log("Loading NFTs...");
  } else {
    if (errorNfts) {
      console.log("NFTs Error: ", errorNfts);
    } else {
      console.log("NFTs:", nfts);
    }
  }
  return (
    <div className={styles.container}>
      <div>My wallet address is {address}</div>
      <div>
        KZFighter Contract:
        {isLoadingContract
          ? "Loading..."
          : contract
          ? contract.getAddress()
          : "undefined"}
      </div>
      <div>
        My KZFighters are:
        {isLoadingNfts
          ? "Loading..."
          : nfts
          ? JSON.stringify(nfts)
          : "undefined"}
      </div>
      <Web3Button
        contractAddress={kzfighter_contract}
        action={(contract) =>
          contract.safeTransferFrom(address, fireblock_address, 1)
        }
        onSuccess={() => alert("Transferred!")}
        onError={() => alert("Something went wrong")}
      >
        Transfer to Fireblocks
      </Web3Button>
    </div>
  );
}
