import axios from 'axios'
import { useCookies } from 'react-cookie'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

// Create an interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		// If the error is 401 and we haven't tried to refresh the token yet
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// Get a new token
				const response = await axios.post(
					`${import.meta.env.VITE_API_URL}/v1/issue-api-key?p_key=${
						import.meta.env.VITE_RESERVEKIT_PUBLIC_KEY
					}`,
				)
				const newToken = response.data.data

				// Delete the old token
				document.cookie = `token=; path=/; max-age=0`

				// Update the cookie with the new token
				document.cookie = `token=${newToken}; path=/; max-age=${15 * 60}` // 15 minutes

				// Update the original request with the new token
				originalRequest.headers.Authorization = `Bearer ${newToken}`

				// Retry the original request
				return axiosInstance(originalRequest)
			} catch (refreshError) {
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	},
)

export const useAxiosWithToken = () => {
	const [cookies] = useCookies(['token'])

	axiosInstance.interceptors.request.use(config => {
		if (cookies.token) {
			config.headers.Authorization = `Bearer ${cookies.token}`
		}
		return config
	})

	return axiosInstance
}

export default axiosInstance
