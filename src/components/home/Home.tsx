import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { mainService } from "../../services/main.service";
import Header from "../../pages/Header";
import { User } from "../../models/user.model";
import { Game } from "../../models/game.model";

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

    return (
        <>
            <Header/>
            <p>Home</p>
            <div className="game-section">
                <h1>Start a new Game</h1>
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