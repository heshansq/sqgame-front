import axios from 'axios';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

export const mainService = {
    request: (url: string, customConfig = {}, fullResponse = false, accessToken: string = '') => {
        let config = {
			url,
			method: 'get',
            headers: {'Content-Type': 'application/json', Authorization: ''},
			validateStatus: (status: any) => {
				return status >= 200 && status < 400
			},
			...customConfig
		}

		if (accessToken !== '') {
            config = {...config, headers: {...config.headers, Authorization: `Bearer ${accessToken}`}}
		}

		return axios(config);//.then((response) => response)
    },
    post: (url: string, data = {}, config = {}) => {
		config = {
			method: 'POST',
			data,
			...config
		}

		return mainService.request(url, config)
	},
	get: (url: string, config = {}, fullResponse = false) => {
		config = {
			method: 'get',
			...config
		}

		return mainService.request(url, config, fullResponse)
	},
    loginUser: (email: string, password: string) => {
        return mainService.post('https://localhost:7214/User/authenticate', { email, password });
    },
    updateConnectionId: (userId: string, connectionId: string) => {
        return mainService.post('https://localhost:7214/User/connectionid', { userId, connectionId });
    },
	registerUser: (user: User) => {
		return mainService.post('https://localhost:7214/User', user);
	},
	getAllOnlineUsers: () => {
		return mainService.get('https://localhost:7214/User/onlineusers');
	},
	startGame: (game: Game) => {
		return mainService.post('https://localhost:7214/Game', game);
	}
}