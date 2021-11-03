import './App.css';
import AppBar from '@mui/material/AppBar';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import MyToken from './abi/MyToken.json';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'

function App() {

  const [ethBalance, setEthBalance] = useState(0);
  const [myTokenBalance, setMyTokenBalance] = useState(0);
  const [ethAddress, setEthAddress] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [contract, setContract] = useState(null);
  const [buyInput, setBuyInput] = useState(0);
  const [sellInput, setSellInput] = useState(0);


  useEffect(async () => {
    setLoadingData(true);
    await loadWeb3();
    await loadBlockChainData();
    setLoadingData(false);
  }, [])

  async function buyTokens(value){
    await contract.methods.buyToken().send({from: ethAddress, value: Web3.utils.toWei((value/100).toString())}).then((rec) => {
      console.log(rec);
      loadBlockChainData();
      Swal.fire(
        'Good job!',
        'You Bought ' + (value*100) +' HeadToken for ' + (value) + 'ETH',
        'success'
      )
    });
  }
  async function sellTokens(value){
    console.log("Selling " + value);
    await contract.methods.sellToken(value).send({from: ethAddress}).then((rec) => {
      console.log(rec);
      loadBlockChainData();
      Swal.fire(
        'Good job!',
        'You Sold ' + value +' HeadToken for ' + (value/100) + 'ETH',
        'success'
      )
    });
  }

  async function loadBlockChainData() {
    const web3 = window.web3;
    await window.ethereum.enable();

    //Get Accounts
    const accounts = await web3.eth.getAccounts();
    console.log("Found Accounts");
    setEthAddress(accounts[0]);

    //get Balance
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    console.log(ethBalance);
    setEthBalance(web3.utils.fromWei(ethBalance));

    //get Contract
    const abi = MyToken;
    const address = "0x3FFb7db9b370aC2D997dE18960da96DC1243f0D7";
    console.log(abi);

    const myToken = new web3.eth.Contract(abi, address);
    setContract(myToken);
    let balance = await myToken.methods.balanceOf(accounts[0].toString()).call();
    console.log(balance);
    setMyTokenBalance(balance);
  }
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Didn't find any web3 provider !");
    }
  }
  return (
    <div className="App">
      <AppBar position="static">
        <div className="appBar">HeadToken Exchange</div>
      </AppBar>

      {loadingData && <div>Loading Data...</div>}
      {!loadingData &&
        <div className="form">
          <h2>Platform Exchange</h2>
          <div className="fullWidth">
            <div className="text-line">
              <div className="Title">Buy Tokens</div>
              <div className="amount">you have : {ethBalance} eth</div>
            </div>
            <div className="button-row">
              <TextField variant="outlined" label="Buy Tokens" id="sellTokensButton" fullWidth value={buyInput} onChange={(e) => {setBuyInput(e.target.value);}}/>
              <Button variant="contained" onClick={() => {buyTokens(buyInput)}}>Buy HeadToken</Button>
            </div>
            <div className="amount"> For : {buyInput / 100} eth</div>
          </div>
          <div className="fullWidth">
            <div className="text-line">
              <div className="Title">Sell Tokens</div>
              <div className="amount">you have : {myTokenBalance} HeadToken</div>
            </div>
            <div className="button-row">
              <TextField variant="outlined" label="Sell Tokens" id="sellTokensButton" fullWidth value={sellInput} onChange={(e) => {setSellInput(e.target.value);}}/>
              <Button variant="contained" onClick={() => {sellTokens(sellInput)}}>Sell HeadToken</Button>
            </div>
            <div className="amount"> For : {sellInput / 100} eth</div>
          </div>


        </div>}

    </div>
  );
}

export default App;
