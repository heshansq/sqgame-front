import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mainService } from "../services/main.service";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
const Header = () => {

    const [userData, setUserData] = useState<any>();
    const navigate = useNavigate();
    const [ connection, setConnection ] = useState<HubConnection | undefined>();
    const [ connectionId, setConnectionId ] = useState<string | undefined>();
    const [ userId, setUserId ] = useState<string>();
    const [ newGameBegin, setNewGameBegin ] = useState<any>();
    const [ gameAccept, setGameAccept ] = useState<any>();
    const [ currentUser, setCurrentUser ] = useState<any>();
    const [ pokemonBalance, setPokemonBalance ] = useState<any>();
    const [ provider, setProvider ] = useState<any>(null);
    const [ ethAccount, setEthAccount ] = useState<any>(null);
    const [ isMetamaskEnabled, setIsMetamaskEnabled ] = useState<any>(0);

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
            setUserData(userData);
            setCurrentUser(userData);
            setUserId(userData?.user?.id);

           if(window.ethereum) {
            setProvider(window.ethereum);
            setIsMetamaskEnabled(1);
           } else {
            setIsMetamaskEnabled(2);
           }
        } 

        let accessToken = userData?.token;

        const options: IHttpConnectionOptions = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
            /*,
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets*/
        };
        /**
         const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7214/signalrgameeventhub", options)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);
         * 
         */

        
    }, []);

    useEffect(() => {
        if (provider && typeof provider !== "undefined") {
            provider.on('accountsChanged', async () => {
                console.log('ethereum change happened');
                getEthAccount();
            });
            getEthAccount();
        }
    }, [provider]);

    useEffect(() => {
        /**
         * 
         if (connection) {
            console.log({connection});
            connection.start()
                .then(result => {
                    console.log('Connected!', result);
                    connection.invoke('GetConnectionId').then((connectionId: any) => {
                        console.log({connectionId});
                        setConnectionId(connectionId);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
         */
        
    }, [connection])

    useEffect(() => {
        /**
         console.log('11', userId);
        if (userId && connectionId && connection) {
            mainService.updateConnectionId(userId, connectionId).then((res) => {
                console.log('updated connection id');
                connection.on('gameStart', data => {
                    console.log('response data::', JSON.parse(data));
                    setNewGameBegin(JSON.parse(data));
                });
            });
        }
         */
        
    }, [connectionId, connection, userId])

    const logoutUser = () => {
        if (userData && userData?.user?.id) {
            localStorage.removeItem('userdata');
            console.log('userData::', {userData});
            mainService.updateConnectionId(userData?.user?.id, '').then((res) => {
                console.log('removed connection id');
            }).finally(() => {
                navigate('/');
            });
        }
    }

    const onWeb3Connect = async () => {
        /**
         * 
         const { ethereum } = window
        if (ethereum) {
            let provider = ethereum;
            if (typeof provider !== "undefined") {
              await provider.request({ method: "eth_requestAccounts" });
              const web3 = new Web3(provider);
              const accounts = await web3.eth.getAccounts();
              const account = accounts[0];
              console.log(account);
            } else {
              console.log("Non-ethereum browser detected.Please install Metamask");
            }
        }
         */

        if (window.ethereum) {
            let provider = window.ethereum;
            if (typeof provider !== "undefined") {
              await provider.request({ method: "eth_requestAccounts" });
              const web3 = new Web3(provider);
              const accounts = await web3.eth.getAccounts();
              const account = accounts[0];
              console.log(account);
            } else {
              console.log("Non-ethereum browser detected.Please install Metamask");
            }
        }
        
        /**
         * 
         const web3 = await detectEthereumProvider(); // Use Metamask-injected web3
        if (web3) {
            await web3.request({ method: 'eth_requestAccounts'});
            const addresses = await web3.eth.getAccounts();
        }
         */
        
    };


    const gameContractABI: any = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approveSpenderFromOwner",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approveSpenderSection",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "getAllowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Bought",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "buy",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAmountCheck",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "sell",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Sold",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferSingleTokenToWinner",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferSingleTokenToWinnerWithSpender",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "_balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "currentBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_useraddress",
                    "type": "address"
                }
            ],
            "name": "currentBalanceUser",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balanceData",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "token",
            "outputs": [
                {
                    "internalType": "contract Token",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const moneyContractAddress = "0xA17BB8896040B2383277cd3Dc7b871Adec5726ED";

    const getEthAccount = () => {
        provider.request({ method: "eth_requestAccounts" }).then(() => {
            const web3 = new Web3(provider || "https://goerli.etherscan.io");
            //const web3 = new Web3(provider || "https://mumbai.polygonscan.com/");

            web3.eth.getAccounts().then((accounts) => {
                const account = accounts[0];
                console.log('yes eth coming here::', account);
                setEthAccount(account);
            });
            
        });
    }

    useEffect(() => {
        if (ethAccount && currentUser?.id) {
            mainService.updatePublicKey(currentUser.id, ethAccount).then((updateSuccess) => {
                console.log('user update success', {updateSuccess});
            });
        }
    }, [ethAccount, currentUser]);

    const buyTokens = (type = 7, pkdtVal = 0) => {
        if (currentUser && provider && ethAccount) {
            provider.request({ method: "eth_requestAccounts" }).then(() => {
                const web3 = new Web3(provider || "https://goerli.etherscan.io");
                //const web3 = new Web3(provider || "https://mumbai.polygonscan.com/");

                const contract: any = new web3.eth.Contract(gameContractABI, moneyContractAddress);
                    console.log('contract comes::', contract);

                /**
                     * 
                     contract.methods.buy().call(1).then((res: any) => {
                        console.log('resresres:', res);
                    });
                    */
                if (type === 1 && pkdtVal > 0) {
                    contract.methods.buy().send({from: ethAccount, value: pkdtVal}).then((res: any) => {
                        console.log('resres::', {res});
                        buyTokens();
                    }).catch((error: any) => {
                        console.log('error:::', {error});
                    });
                } else if (type === 2) {
                    //contract.methods.transferSingleTokenToWinner("0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5", account, 1).send({from: account}).then((res: any) => {
                    contract.methods.transferSingleTokenToWinner("0x64670508d670a88536c5fB36AbDE75D2a16475f0", ethAccount, 10).send({from: ethAccount}).then((res: any) => {
                        console.log('coming here123::', res);
                        buyTokens();
                    });
                }  else if (type === 3) {
                    //contract.methods.approveSpenderFromOwner(account, "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5", 5).send({from: account}).then((res: any) => {
                    contract.methods.approveSpenderFromOwner(ethAccount, "0x64670508d670a88536c5fB36AbDE75D2a16475f0", 50).send({from: ethAccount}).then((res: any) => {
                        console.log('coming here123::', res);
                        buyTokens(4);
                    });
                } else if (type === 4) {
                    //contract.methods.getAllowance(account, "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5").call({from: account}).then((res: any) => {
                    contract.methods.getAllowance(ethAccount, "0x64670508d670a88536c5fB36AbDE75D2a16475f0").call({from: ethAccount}).then((res: any) => {
                        console.log('getAllowance', res);
                    });
                }  else if (type === 5) {
                    contract.methods.transferSingleTokenToWinnerWithSpender("0x772f554D67ed897e9e350E7ab158c7d20C534cCb", "0x1cd68536C6B598605e12e1c0290E52E567bEA234",ethAccount, 10).send({from: ethAccount}).then((res: any) => {
                        console.log('getAllowance', res);
                    });
                } else if (type === 6) {
                    //mainService.transferCoinsToWinner(account, "0x9D77cfbf4567945eE4a27334Cec11aBB865E31eF", "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5").then((res: any) => {
                    let wonPublicKey = "0xB4905829f61E9621Ef4a3bb1D516C26fd0695FD4";
                    if (gameAccept?.opuserpublickey === ethAccount) {
                        console.log('coming here opuserpublickey', {opuserpublickey: gameAccept?.opuserpublickey}, {ethAccount});
                        wonPublicKey = gameAccept?.startuserpublickey;
                    } else {
                        console.log('coming here startuserpublickey', {opuserpublickey: gameAccept?.opuserpublickey}, {ethAccount});
                        wonPublicKey = gameAccept?.opuserpublickey;
                    }

                    mainService.transferCoinsToWinner(ethAccount, wonPublicKey, "0x64670508d670a88536c5fB36AbDE75D2a16475f0").then((res: any) => {
                        console.log({res});
                        buyTokens();
                    });
                } else {
                    contract.methods.currentBalance().call({from: ethAccount}).then((res: any) => {
                        console.log('resresres:', res);
                        setPokemonBalance(res);
                    });
                }
                
            });
        }
    }

    const onStartTheGame = () => {
        buyTokens(3);
    }

    const onGameRequest = (isStart = false) => {
        if (isStart && userId) {
            console.log({newGameBegin});
            mainService.acceptGameRequest(userId, newGameBegin?.gameId).then((res: any) => {
                console.log('Accepted', {res});
                onStartTheGame();
            });
        }
    }

    return (
        <>
            <div className="header-wrapper">
                <ul>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                    {userData ? (
                        <>
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/todo">Todo List</Link>
                            </li>
                            <li>
                                <a onClick={logoutUser}>Logout</a>
                            </li>
                        </>
                    ) : null}
                    
                </ul>
                {(newGameBegin && userId !== newGameBegin?.startuserid) ? (
                    <>
                        You have Received new Game Request, Do you want to Accept it?
                        <button onClick={() => {onGameRequest(true)}}>Accept</button>
                        <button>Reject</button>
                    </>
                ) : null}
            </div>
        </>
    );
}
export default Header;