import { useQuery } from '@tanstack/react-query'
import { useAxiosWithToken } from '../axiosInstance'

interface Service {
	data: {
		id: string
		name: string
		description: string
	}
}

export const useService = () => {
	const axios = useAxiosWithToken()

	return useQuery<Service>({
		// @ts-ignore
		queryKey: ['services', import.meta.env.VITE_RESERVEKIT_SERVICE_ID],
		queryFn: async () => {
			const { data } = await axios.get(
				// @ts-ignore
				`/v1/services/${import.meta.env.VITE_RESERVEKIT_SERVICE_ID}`,
			)
			return data
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
	})
}
