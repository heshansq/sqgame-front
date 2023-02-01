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
    const [ pokemonBalance, setPokemonBalance ] = useState();

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
        } else {
            navigate('/');
        }
        console.log('user data::', userData);
        let accessToken = userData.token;
        if (userData?.user?.id) {
            setUserId(userData?.user?.id);
            setCurrentUser(userData?.user);
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

    }, []);

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
        mainService.startGame(game).then((response: any) => {
            console.log('response:::', {response});
            setGameSuccessStart(response);
        });
        console.log('game data:::', game);
    }

    const gameContractABI: any = [
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
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "buy",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
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
          "type": "function",
          "payable": true
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
          "name": "getAmountCheck",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
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
          "stateMutability": "nonpayable",
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
              "name": "balance",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
    ];

    const moneyContractAddress = "0x194597Fd39Fe16B1fa424E2b0997a9573d1CAA5B";

    const buyTokens = (type = 7, pkdtVal = 0) => {
        if (currentUser) {
            if (window.ethereum) {
                let provider = window.ethereum;
                console.log('typeof provider', typeof provider);
                if (typeof provider !== "undefined") {
                  provider.request({ method: "eth_requestAccounts" }).then(() => {
                    const web3 = new Web3(provider || "http://127.0.0.1:7545");
                    web3.eth.getAccounts().then((accounts) => {
                        const account = accounts[0];
                        console.log('account::::', accounts);
                        const contract: any = new web3.eth.Contract(gameContractABI, moneyContractAddress);
                        console.log('contract comes::', contract);

                        /**
                         * 
                         contract.methods.buy().call(1).then((res: any) => {
                            console.log('resresres:', res);
                        });
                        */
                        if (type === 1 && pkdtVal > 0) {
                            contract.methods.buy().send({from: account, value: pkdtVal}).then((res: any) => {
                                console.log('resres::', {res});
                                buyTokens();
                            }).catch((error: any) => {
                                console.log('error:::', {error});
                            });
                        } else if (type === 2) {
                            contract.methods.transferSingleTokenToWinner("0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5", account, 1).send({from: account}).then((res: any) => {
                                console.log('coming here123::', res);
                                buyTokens();
                            });
                        }  else if (type === 3) {
                            contract.methods.approveSpenderFromOwner(account, "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5", 5).send({from: account}).then((res: any) => {
                                console.log('coming here123::', res);
                                buyTokens(4);
                            });
                        } else if (type === 4) {
                            contract.methods.getAllowance(account, "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5").call({from: account}).then((res: any) => {
                                console.log('getAllowance', res);
                            });
                        }  else if (type === 5) {
                            contract.methods.transferSingleTokenToWinnerWithSpender("0x772f554D67ed897e9e350E7ab158c7d20C534cCb", "0x1cd68536C6B598605e12e1c0290E52E567bEA234",account, 1).send({from: account}).then((res: any) => {
                                console.log('getAllowance', res);
                            });
                        } else if (type === 6) {
                            mainService.transferCoinsToWinner(account, "0x9D77cfbf4567945eE4a27334Cec11aBB865E31eF", "0x950B4aF4Cf7a7933A63866a09Ef1D31b0F8500e5").then((res: any) => {
                                console.log({res});
                                buyTokens();
                            });
                        } else {
                            contract.methods.currentBalance().call({from: account}).then((res: any) => {
                                console.log('resresres:', res);
                                setPokemonBalance(res);
                            });
                        }
                        
                    });
                    
                  });
                } else {
                  console.log("Non-ethereum browser detected.Please install Metamask");
                }
            }
        }
    }

    const onBuyToken = (e: any) => {
        e.preventDefault();
        
        let pkdtVal = e.target[0].value;
        if (pkdtVal > 0) {
            buyTokens(1, pkdtVal);
        }
    }

    const onStartTheGame = () => {
        buyTokens(3);
    }

    const onLostGame = () => {
        buyTokens(6);
    }

    useEffect(() => {
        if (currentUser) {
            buyTokens();
        }
    }, [currentUser]);

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
                                    My Pokemon Balance: {pokemonBalance}
                                </p>
                            </>
                        ) : null}
                        <button onClick={() => buyTokens()}>Check Balance</button>
                        <form onSubmit={onBuyToken}>
                            <input type="text" placeholder="Enter PKTD Amount"/>
                            <button>Buy PokemonTD</button>
                        </form>
                        <br/>
                        <button onClick={onStartTheGame}>Start the Game</button>
                        <button onClick={onLostGame}>I Lost the Game</button>
                        <button onClick={() => {buyTokens(4)}}>Get Allowance</button>
                        <button onClick={() => {buyTokens(5)}}>Spend</button>
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
                {(!gameSuccessStart && newGameBegin) ? (
                    <>
                        You have Received new Game Request, Do you want to Accept it?
                        <button>Accept</button>
                        <button>Reject</button>
                    </>
                ) : null}
                {(gameSuccessStart ? (
                    <p>
                        Waiting for the opponent!
                    </p>
                ) : (
                    <>
                        {(startGame?.opponent?.name ? (
                            <div>
                                <label>
                                    Opponent Name: {startGame?.opponent?.name}
                                </label>
                                <form onSubmit={onStartGame}>
                                    <input type="text" placeholder="Enter Game Name"/>
                                    <input type="submit" value="Start Game"/>
                                </form>
                            </div>
                        ) : null)}
                    </>
                ))}
                
            </div>
        </>
    );
}
export default Home;