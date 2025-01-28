import axios from 'axios'

const axiosInstance = axios.create({
	// @ts-ignore
	baseURL: import.meta.env.VITE_API_URL,
})

export const useAxiosWithToken = () => {
	axiosInstance.interceptors.request.use(config => {
		config.headers.Authorization = `Bearer ${
			// @ts-ignore
			import.meta.env.VITE_RESERVEKIT_API_KEY
		}`

		return config
	})

	return axiosInstance
}

export default axiosInstance
