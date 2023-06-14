import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

import  secp  from "ethereum-cryptography/secp256k1";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
function Transfer({ address, setBalance,privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    var signature = utf8ToBytes(address);
    var hash = keccak256(signature);
    signature = secp256k1.sign(hash, privateKey, {recovered:true});
    console.log(signature)
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: signature,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sign and Transfer" />
    </form>
  );
}

export default Transfer;
