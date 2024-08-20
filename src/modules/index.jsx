import React, { useState } from 'react'
import { Buffer } from 'buffer';
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

window.Buffer = Buffer;

export default function Index() {

  const [mnemonic, setMnemonic] = useState('')
  const [seed, setSeed] = useState('')
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

  return (
    <div>
      <h3>Generate Mnemonics</h3>
      <h2>{mnemonic}</h2>
      <h2>{seed}</h2>
      <button onClick={generateMnemonicLocal} disabled={disabled}>Generate</button>
      
      <button onClick={() => addSolWallet()}>Add Sol Wallet</button>
      <h2>Sol Wallets</h2>
      {solWallets.map(obj => <h3>{obj}</h3>)}
      <button onClick={addEthWallet}>Add Eth Wallet</button>
      <h3>Eth Wallets</h3>
      {ethWallets.map(obj => <h3>{obj}</h3>)}


    </div>

  )
}
