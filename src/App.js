import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0x1c304432Ea20719dCcaD0c07e60fEfe910ffBEB2";
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greeting, setGreetingValue] = useState("");
  const [data, setData] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState(0);

  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getBalance = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  };

  const sendCoins = async () => {
    if (window.ethereum) {
       await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const transaction = await contract.transfer(userAccount, amount);
    const done = await transaction.wait();
    // if (done) {
    //   console.log(`${amount} coins succesfully sent to ${userAccount}`);
    //   setUserAccount("");
    //   setAmount(0);
    // }
    console.log(`${amount} coins succesfully sent to ${userAccount}`);
    }
  };

  const fetchGreeting = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setData(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (window.ethereum) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      const done = await transaction.wait();
      if (done) {
        setGreetingValue("");
        console.log(done);
      }
      fetchGreeting();
    }
  };

  const handleChange = (e) => {
    setGreetingValue(e.target.value);
  };

  // useEffect(() => {
  //   fetchGreeting();
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>{data}</h2>
        <button onClick={setGreeting}>Set greeting</button>
        <input
          type="text"
          placeholder="say hello"
          value={greeting}
          onChange={handleChange}
        />

        <br />

        <button onClick={getBalance}>Get balance</button>
        <button onClick={sendCoins}>Send coins</button>
        <input
          type="text"
          placeholder="eth address"
          value={userAccount}
          onChange={(e) => setUserAccount(e.target.value)}
        />
        <input
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </header>
    </div>
  );
}

export default App;
