import {
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useContractWrite,
  useOwnedNFTs,
  useNFTs,
  useTransferNFT,
  useSigner,
  useSDK,
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Constants
  const fireblock_address = "0xaD2232fbf866C40a4ce24B95cDd3f867b7A60810";
  const kzfighter_contract = "0x60ce73cF71Def773a7a8199D4e6B2F237D5a6b32";
  const txId = Date.now();
  const timestamp = txId;
  // Hooks
  const address = useAddress();
  const signer = useSigner();
  const sdk = useSDK();
  const {
    contract,
    isLoading: isLoadingContract,
    error: errorContract,
  } = useContract(kzfighter_contract);
  const {
    mutateAsync: transferNFT,
    isLoading: isLoadingTransferNFT,
    error: errorTransferNFT,
  } = useTransferNFT(contract);
  const {
    mutateAsync: batchClaim,
    isLoading: isLoadingBatchClaim,
    error: errorBatchClaim,
  } = useContractWrite(contract, "batchClaim");

  // State handlers
  const [tokenId, setTokenId] = useState(100);
  const [values, setValues] = useState({});
  const [signature, setSignature] = useState(null);
  // Effects
  const handleChange = (event) => {
    setTokenId(event.target.value);
  };
  useEffect(() => {
    const types = {
      inputs: [
        { name: "toAccount", type: "address" },
        { name: "tokenIds", type: "uint256[]" },
        { name: "txId", type: "uint64" },
        { name: "timestamp", type: "uint64" },
      ],
    };
    const domain = {
      name: "Test",
      version: "1",
      chainId: 137,
      verifyingContract: kzfighter_contract,
    };

    async function signMessage() {
      let message = {
        toAccount: address,
        tokenIds: [tokenId],
        txId: txId,
        timestamp: timestamp,
      };
      console.log("message: ", domain, types, message);
      const { payload, signature } = await sdk.wallet.signTypedData(
        domain,
        types,
        message,
      );
      console.log("signature: ", signature, payload);
      message.signature = signature;
      setSignature(signature);
      setValues(message);
    }
    if (sdk && sdk.wallet.isConnected() && tokenId) {
      signMessage().catch(console.error);
    }
  }, [tokenId, address, sdk, timestamp, txId]);

  return (
    <div className={styles.container}>
      <div>My wallet address is {address}</div>
      <div>
        <label for="tokenId">TokenID to transfer:</label>
        <input
          type="number"
          id="tokenId"
          name="tokenId"
          min="0"
          max="1000000000000"
          onChange={handleChange}
          value={tokenId}
        />
      </div>
      <div>
        KZFighter Contract:
        {isLoadingContract
          ? "Loading..."
          : contract
          ? contract.getAddress()
          : "undefined"}
      </div>
      <div>
        Values:
        <code>{JSON.stringify(values, null, "\n")}</code>
      </div>
      <div>
        Signature:
        <code>{signature}</code>
      </div>

      <Web3Button
        contractAddress={kzfighter_contract}
        action={() =>
          batchClaim({
            args: [
              values.toAccount,
              values.tokenIds,
              values.txId,
              values.timestamp,
              values.signature,
            ],
          })
        }
        onSuccess={() => alert("Claimed!")}
        onError={(error) => alert(error)}
      >
        Claim NFTs
      </Web3Button>

      <Web3Button
        contractAddress={kzfighter_contract}
        action={() =>
          transferNFT({ to: fireblock_address, tokenId: { tokenId } })
        }
        onSuccess={() => alert("Transferred!")}
        onError={(error) => console.error(error)}
      >
        Transfer to Fireblocks
      </Web3Button>
    </div>
  );
}
