import { useQuery } from '@tanstack/react-query'
import { useAxiosWithToken } from '../axiosInstance'

interface Service {
	data: {
		id: string
		name: string
		description: string
	}
}

export const useService = (serviceId: string) => {
	const axios = useAxiosWithToken()

	return useQuery<Service>({
		queryKey: ['services', serviceId],
		queryFn: async () => {
			const { data } = await axios.get(`/v1/services/${serviceId}`)
			return data
		},
	})
}
