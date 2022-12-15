import axios from 'axios';

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
    loginUser: (email: string, password: string) => {
        return mainService.post('https://localhost:7214/User/authenticate', { email, password });
    },
    updateConnectionId: (userId: string, connectionId: string) => {
        return mainService.post('https://localhost:7214/User/connectionid', { userId, connectionId });
    }
}