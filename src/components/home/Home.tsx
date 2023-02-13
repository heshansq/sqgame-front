import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { mainService } from "../../services/main.service";
import Header from "../../pages/Header";
import { User } from "../../models/user.model";
import { Game } from "../../models/game.model";
import Web3 from "web3";

const Home = () => {

    const navigate = useNavigate();

    const [ connection, setConnection ] = useState<HubConnection | undefined>();
    const [ connectionId, setConnectionId ] = useState<string | undefined>();
    const [ userId, setUserId ] = useState<string>();
    const [ onlineUsers, setOnlineUsers ] = useState<any[]>([]);
    const [ currentUser, setCurrentUser ] = useState<any>();
    const [ startGame, setStartGame ] = useState<any>();
    const [ newGameBegin, setNewGameBegin ] = useState<any>();
    const [ gameSuccessStart, setGameSuccessStart ] = useState<any>();
    const [ gameAccept, setGameAccept ] = useState<any>();
    const [ pokemonBalance, setPokemonBalance ] = useState();
    const [ provider, setProvider ] = useState<any>(null);
    const [ ethAccount, setEthAccount ] = useState<any>(null);
    const [ isMetamaskEnabled, setIsMetamaskEnabled ] = useState<any>(0);
    const [ isStartGame, setIsStartGame ] = useState<any>(0);
    const [gameFinished, setGameFinished] = useState<any>(null);
    

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
            console.log('user data::', userData);
            let accessToken = userData.token;
            if (userData?.user?.id) {
                setUserId(userData?.user?.id);
                setCurrentUser(userData?.user);

                if(window.ethereum) {
                    setProvider(window.ethereum);
                    setIsMetamaskEnabled(1);
                } else {
                    setIsMetamaskEnabled(2);
                }
            }

            const options: IHttpConnectionOptions = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                /*,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets*/
            };

            const newConnection = new HubConnectionBuilder()
                .withUrl("https://localhost:7214/signalrgameeventhub", options)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            setConnection(newConnection);

            mainService.getAllOnlineUsers().then((users: any) => {
                console.log('all online users:::', users);
                setOnlineUsers(users?.data ?? []);
            });
        } else {
            navigate('/');
        }
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
        if (connection) {
            console.log({connection});
            connection.start()
                .then(result => {
                    console.log('Connected!', result);
                    connection.invoke('GetConnectionId').then((connectionId: any) => {
                        console.log({connectionId});
                        setConnectionId(connectionId);
                    });

                    connection.on('onlineUsers', data => {
                        console.log('onlineUsers data::', data);
                        setOnlineUsers(data ?? []);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection])

    useEffect(() => {
        if (userId && connectionId && connection) {
            mainService.updateConnectionId(userId, connectionId).then((res) => {
                console.log('updated connection id');
                connection.on('gameStart', data => {
                    console.log('response data::', JSON.parse(data));
                    setNewGameBegin(JSON.parse(data));
                });
                connection.on('gameAccept', data => {
                    console.log('gameAccept response data::', JSON.parse(data));
                    setGameAccept(JSON.parse(data));
                    setIsStartGame(4);
                });

                connection.on('gameWon', data => {
                    let userWinObj = JSON.parse(data);
                    setGameAccept(userWinObj);
                    console.log('gameAccept:::', {gameAccept});
                    console.log('gameWon response data::', JSON.parse(data));
                    setGameFinished(userWinObj);
                    if (userWinObj?.winnerUser?.Id !== userId) {
                        console.log("Yes I Lost The Game");
                        buyTokens(6, 0, null, null, userWinObj);
                    }
                });
            });
        }
    }, [connectionId, connection])

    const gameStartStepOne = (user: User) => {
        console.log('start here::: ', {user});
        setStartGame({...startGame, opponent: user})
    }

    const onStartGame = (e: any) => {
        e.preventDefault();
        
        let gameName = e.target[0].value;

        let game: Game = {gamename: gameName, type: 1, status: 1, gamestartuser: currentUser.id, gameopponent: startGame.opponent.id};
        onStartTheGame(game);
        
        console.log('game data:::', game);
    }

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
                buyTokens();
            });
        }
    }, [ethAccount, currentUser]);

    const buyTokens = (type = 7, pkdtVal = 0, gameStartData = null, acceptGame: any = null, afterAcceptData: any = null) => {
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
                        setIsStartGame(2);
                        if (gameStartData) {
                            mainService.startGame(gameStartData).then((response: any) => {
                                console.log('response:::', {response});
                                setGameSuccessStart(response);
                                setIsStartGame(3);
                            });
                        }

                        if (acceptGame) {
                            setIsStartGame(2);
                            mainService.acceptGameRequest(acceptGame?.userId, acceptGame?.gameId).then((res: any) => {
                                console.log('Accepted', {res});
                                setIsStartGame(3);
                            });
                        }
                    }).catch((e: any) => {
                        setIsStartGame(5);
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
                    let user1StartPublicKey, user1OpPublicKey;
                    console.log('afterAcceptData::::', {afterAcceptData});
                    if (gameAccept) {
                        user1StartPublicKey = gameAccept?.startuserpublickey;
                        user1OpPublicKey = gameAccept?.opuserpublickey;

                    } else {
                        user1StartPublicKey = afterAcceptData?.startuserpublickey;
                        user1OpPublicKey = afterAcceptData?.opuserpublickey;
                    }

                    if (gameAccept?.opuserpublickey === ethAccount) {
                        console.log('coming here opuserpublickey', {opuserpublickey: gameAccept?.opuserpublickey}, {ethAccount});
                        wonPublicKey = user1StartPublicKey;
                    } else {
                        console.log('coming here startuserpublickey', {opuserpublickey: gameAccept?.opuserpublickey}, {ethAccount});
                        wonPublicKey = user1OpPublicKey;
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

    const onBuyToken = (e: any) => {
        e.preventDefault();
        
        let pkdtVal = e.target[0].value * 10;
        if (pkdtVal > 0) {
            buyTokens(1, pkdtVal);
        }
    }

    const onStartTheGame = (gameStartData: any = null, acceptGame: any = null) => {
        if (gameStartData || acceptGame) {
            setIsStartGame(1);
        }
        buyTokens(3, 0, gameStartData, acceptGame);
    }

    const onLostGame = () => {
        buyTokens(6);
    }

    const onGameRequest = (isStart = false) => {
        if (isStart && userId) {
            console.log({newGameBegin});
            onStartTheGame(null, {userId, gameId: newGameBegin?.gameId});
            /**
             mainService.acceptGameRequest(userId, newGameBegin?.gameId).then((res: any) => {
                console.log('Accepted', {res});
                onStartTheGame();
            });
             * 
             */
            
        }
    }


    return (
        <>
            <Header/>
            <p>Home</p>
            <div className="game-section">
                <h1>Start a new Game</h1>
                {(currentUser) ? (
                    <>
                        {(pokemonBalance) ? (
                            <>
                                <p>
                                    My Pokemon Balance: {pokemonBalance / 10}
                                </p>
                            </>
                        ) : null}
                        <button onClick={() => buyTokens()}>Check Balance</button>
                        <form onSubmit={onBuyToken}>
                            <input type="text" placeholder="Enter PKTD Amount"/>
                            <button>Buy PokemonTD</button>
                        </form>
                        {
                            /**
                              <br/>
                        <button onClick={() => {onStartTheGame()}}>Start the Game</button>
                        <button onClick={onLostGame}>I Lost the Game</button>
                        <button onClick={() => {buyTokens(4)}}>Get Allowance</button>
                        <button onClick={() => {buyTokens(5)}}>Spend</button>
                             * 
                             */
                        }
                    </>
                ) : null}
                <div>
                    <h2>Online Users</h2>
                    {(onlineUsers && onlineUsers.length > 0) ? (
                        <ul>
                            {onlineUsers.map((user: any, index: number) => {
                                return (
                                    <li key={`online-user-` + index}>
                                        {(user.id === currentUser.id) ? (
                                            <a key={`online-` + index}>{user?.name ?? 'No Name'}(Me)</a>
                                        ) : (
                                            <a onClick={() => {gameStartStepOne(user)}} key={`online-` + index}>{user?.name ?? 'No Name'}</a>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    ) : null}
                    
                </div>

                {
                    isStartGame === 1 ? (
                        <p>
                            Initiating the game!
                        </p>
                    ) : (isStartGame === 2) ? (
                        <p>
                            Starting the game!
                        </p>
                    ) : (isStartGame === 3) ? (
                        <p>
                            Waiting for the opponent!
                        </p>
                    ) : (isStartGame === 4) ? (
                        <p>
                            Let the game begin
                        </p>
                    ) : (isStartGame === 5) ? (
                        <p>
                            User Cancelled or Error Occured
                        </p>
                    ) : null
                }

                {(!gameSuccessStart && newGameBegin && !gameAccept) ? (
                    <>
                        You have Received new Game Request, Do you want to Accept it?
                        <button disabled={isStartGame !== 0 && isStartGame !== 5} onClick={() => { onGameRequest(true) }}>Accept</button>
                        <button disabled={isStartGame !== 0 && isStartGame !== 5}>Reject</button>
                    </>
                ) : null}
                {(gameSuccessStart ? (
                    <></>
                ) : (
                    <>
                        {(startGame?.opponent?.name ? (
                            <div>
                                <label>
                                    Opponent Name: {startGame?.opponent?.name}
                                </label>
                                <form onSubmit={onStartGame}>
                                    <input type="text" placeholder="Enter Game Name"/>
                                    <input disabled={isStartGame !== 0 && isStartGame !== 5} type="submit" value="Start Game"/>
                                </form>
                            </div>
                        ) : null)}
                    </>
                ))}
                {(gameAccept ? (
                    <>
                        {
                            gameFinished ? (
                                <>
                                    <p>
                                        {gameFinished?.winnerUser?.name} won the game!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <button onClick={onLostGame}>I Won the Game</button>
                                    <button onClick={onLostGame}>I Lost the Game</button>
                                </>
                            )
                        }
                    </>
                ) : null)}
                
            </div>
        </>
    );
}
export default Home;