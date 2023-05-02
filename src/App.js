import detectEthereumProvider from "@metamask/detect-provider";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";

const App = () => {
  const [web3API, setWeb3API] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [reload, setReload] = useState(null);

  const canConnectToContract = account && web3API.contract;
  const reloadEffect = useCallback(() => setReload(!reload), [reload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
    });
    provider.on("chainChanged", () => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        // We are in the browser and metamask is running.
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3API((api) => ({ ...api, isProviderLoaded: true }));
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
  }, [web3API, reload]);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3API.web3 && getAccounts();
  }, [web3API.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3API;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    // window.location.reload();
    reloadEffect();
  }, [account, web3API, reloadEffect]);

  const withdraw = async () => {
    const { contract, web3 } = web3API;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });

    // window.location.reload();
    reloadEffect();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3API.isProviderLoaded ? (
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
              {account ? (
                account
              ) : !web3API.provider ? (
                <>
                  <div className="notification is-warning is-size-7 is-rounded">
                    Wallet is not detected!{` `}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href="https://metamask.io/"
                    >
                      Install Metamask
                    </a>
                  </div>
                </>
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
          ) : (
            <span>Looking for Web3 Wallet...</span>
          )}
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToContract && (
            <i className="is-block">Connect to Ganache</i>
          )}
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2"
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-primary"
          >
            Withdraw 0.1 ETH
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
