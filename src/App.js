import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";

const App = () => {
  const [web3API, setWeb3API] = useState({
    web3: null,
    provider: null,
    contract: null,
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);

      if (provider) {
        // We are in the browser and metamask is running.
        setWeb3API({ web3: new Web3(provider), provider, contract });
      } else {
        console.log("Please install Metamask.");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3API;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3API.contract && loadBalance();
  }, [web3API]);

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
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
};

export default App;
