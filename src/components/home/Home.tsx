import { useEffect, useState } from "react";
import { HttpTransportType, HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';

const Home = () => {

    const [ connection, setConnection ] = useState<HubConnection | undefined>();

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
        } else {
            return
        }
        console.log('user data::', userData);
        let accessToken = userData.token;

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

    }, []);

    useEffect(() => {
        if (connection) {
            console.log({connection});
            connection.start()
                .then(result => {
                    console.log('Connected!', result);
    
                    connection.on('gameStart', data => {
                        console.log('response data::', JSON.parse(data));
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection])

    return <p>Home</p>;
}
export default Home;