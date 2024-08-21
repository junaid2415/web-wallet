import React, { useState } from 'react'
import { Buffer } from 'buffer';
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import axios from 'axios';

window.Buffer = Buffer;

export default function Index() {

  const [mnemonic, setMnemonic] = useState('')
  const [seed, setSeed] = useState('')
  const [balance, setBalance] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [solWallets, setSolWallets] = useState([])
  const [ethWallets, setEthWallets] = useState([])

  function generateMnemonicLocal() {
    const mnemonicLocal = generateMnemonic();
    if (mnemonic == "") {
      setMnemonic(mnemonicLocal)
      setDisabled(true)
      setSeed(mnemonicToSeedSync(mnemonicLocal))
    }
  }

  async function addSolWallet() {
    let idx = solWallets.length
    const path = `m/44'/501'/${idx}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    console.log("CHECKKkkkkkkkkkk")
    console.log(derivedSeed, "Derived Seed")
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
    let publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
    setSolWallets([...solWallets, publicKey])
  }

  async function addEthWallet() {
    let idx = ethWallets.length
    const path = `m/44'/60'/${idx}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
    let publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
    setEthWallets([...ethWallets, publicKey])
  }

  async function checkBalanceSol(publicKey){

    const rpcUrl = `https://devnet.helius-rpc.com/?api-key=bf48427a-6612-48d8-97ce-b5cb4a7c054d`
    const body = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getBalance",
      "params": [`${publicKey}`]
    }

    let response  = await axios.post(rpcUrl, body)
    let balance = response?.data?.result?.value
    console.log(balance)
    setBalance(balance)
    return balance
    
  }

  async function checkBalanceEth(publicKey){

    const rpcUrl = `https://devnet.helius-rpc.com/?api-key=bf48427a-6612-48d8-97ce-b5cb4a7c054d`
    const body = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getBalance",
      "params": [`${publicKey}`, "latest"]
  }

    let response  = await axios.post(rpcUrl, body)
    let balance = response?.data?.result?.value
    console.log(balance)
    setBalance(balance)
    return balance

  }

  return (
    <div>
      <h3>Generate Mnemonics</h3>
      <h2>{mnemonic}</h2>
      {/* <h2>{seed}</h2> */}
      <button onClick={generateMnemonicLocal} disabled={disabled}>Generate</button>
      <h3></h3>
      <button onClick={() => checkBalanceSol(solWallets[0])}>Check Balance SOL</button>

      <h3>{balance}</h3>


      <h3></h3>
      <button onClick={() => checkBalanceEth(ethWallets[0])}>Check Balance ETH</button>

      <h3>{balance}</h3>

      

      <button onClick={() => addSolWallet()}>Add Sol Wallet</button>
      <h2>Sol Wallets</h2>
      {solWallets.map(obj => <h3>{obj}</h3>)}

      <button onClick={addEthWallet}>Add Eth Wallet</button>
      <h3>Eth Wallets</h3>
      {ethWallets.map(obj => <h3>{obj}</h3>)}


    </div>

  )
}
