# tide-assignement
Tide Assignement for Five Elements Lab

Il progetto consiste in una dApp che si interfaccia con il protocollo Uniswap e permette il minting di un NFT di benvenuto qualora l'utente avesse effettuato almeno 1 transazione su Uniswap nelle ultime 24h.

In particolare utilizza l'sdk di Metamask per collegare il proprio wallet: al collegamento con il wallet viene effettuata una chiamata REST verso Etherscan per recuperare le transazioni dell'utente. Ricevute le transazioni, esse vengono filtrate per timestamp e selezionate solo le transazioni effettuate nelle ultime 24h.
La ricerca per Uniswap sarà per hash della transazione e avviene tramite l'utilizzo della libreria request-graphql che permette interrogazioni ai grafi di Uniswap.

Qualora il check risultasse avere esito positivo, il pulsante MINT YOUR NFT verrà abilitato.
Il mint avviene per mezzo della libreria web3, che ha il compito di recuperare il contratto e chiamare la funzione mint() di CheckUniswapNFT (contratto disponibile sotto la cartella /smart-contracts/contracts).

Avvio del progetto in locale 

DAPP<br>
La parte di applicazione web è realizzata con React; sarà sufficente entrare nella cartella react-check-uniswap ed eseguire da terminale

    npm install

per installare tutte le librerie necessarie e

    npm run start

Per avviare il progetto.<br><br>
Nota: è necessario inserire la propria API KEY di Etherscan e l'indirizzo del contratto deployato prima di avviare il progetto. Qualora ci fossero modifiche alla struttura del contratto, sostiture il file abi.json con quello risultante dalla nuova compilazione.
<br>

SMART CONTRACT<br>
Lo smart contract è stato compilato e deployato con Truffle e Infura; sarà necessario prima inizializzare il progetto, eseguendo nel terminale dalla cartella /smart-contracts

    truffle init

in seguito sarà necessario compilare lo smart contract

    truffle compile

e successivamente deployare.

    truffle deploy --network sepolia

Nota: Per effettuare il deploy è necessario valorizzare i campi MNEMONIC e INFURA_ENDPOINT nel file truffle.config.js. La configurazione di default prevede il deploy su Sepolia Testnet.




