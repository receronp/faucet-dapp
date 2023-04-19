import detectEthereumProvider from "@metamask/detect-provider";
const HDWalletProvider = require("@truffle/hdwallet-provider");
import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";

const App = () => {
  const [web3API, setWeb3API] = useState({ web3: null, provider: null });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider();
      if (!provider) {
        // We are on the server *OR* the user is not running metamask
        provider = new HDWalletProvider(
          process.env.WEBPACK_PUBLIC_MNEMONIC,
          `https://sepolia.infura.io/v3/${process.env.WEBPACK_PUBLIC_INFURA_API_KEY}`
        );
      }
      setWeb3API({ web3: new Web3(provider), provider });
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3API.web3 && getAccounts();
  }, [web3API.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {account ? (
              account
            ) : (
              <button
                className="button is-small"
                onClick={async () => {
                  try {
                    await web3API.provider.request({
                      method: "eth_requestAccounts",
                    });
                    location.reload();
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
};

export default App;
