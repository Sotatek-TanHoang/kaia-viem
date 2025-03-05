import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  http,
  createPublicClient,
  createWalletClient,
  custom,
  stringify,
  kairos,
  TxType,
  parseKaia,
} from '@tan_hoang/viem-ext'

const publicClient = createPublicClient({
  chain: kairos,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: kairos,
  transport: custom((window as any).klaytn),
})

function Example() {
  const [account, setAccount] = useState<`0x${string}`>()
  const [hash, setHash] = useState<any>()
  const [receipt, setReceipt] = useState<any>()

  const addressInput = React.createRef<HTMLInputElement>()
  const valueInput = React.createRef<HTMLInputElement>()

  const connect = async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }

  const sendTransaction = async () => {
    if (!account) return
    console.log(parseKaia(valueInput.current!.value as `${number}`).toString());

    const tx = await walletClient.prepareTransactionRequest({
      account: account,
      type: TxType.ValueTransfer,
      to: addressInput.current!.value,
      value: parseKaia(valueInput.current!.value as `${number}`),

    })
    console.log(tx);
    const hash = await walletClient.sendTransaction(tx)
    setHash(hash)
  }
  const contractInteraction = async () => {
    const contractAddr = "0x95Be48607498109030592C08aDC9577c7C2dD505";
    const abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newNumber",
            "type": "uint256"
          }
        ],
        "name": "setNumber",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const hash = await walletClient.writeContract({
      abi,
      address: contractAddr,
      functionName: 'setNumber',
      args: ['0x123'],
      account: account as `0x${string}`,
    })
    setHash(hash)
  }

  useEffect(() => {
    ; (async () => {
      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        setReceipt(receipt)
      }
    })()
  }, [hash])

  if (account)
    return (
      <>
        <div>Connected: {account}</div>
        <input ref={addressInput} placeholder="address" />
        <input ref={valueInput} placeholder="value (ether)" />
        <button onClick={sendTransaction}>Send</button>
        {receipt && (
          <div>
            Receipt:{' '}
            <pre>
              <code>{stringify(receipt, null, 2)}</code>
            </pre>
          </div>
        )}
      </>
    )
  return <button onClick={connect}>Connect Wallet</button>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Example />,
)
