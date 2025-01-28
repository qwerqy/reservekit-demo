import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

interface Booking {
	id: string
	name: string
	email: string
	date: string
	time: string
	service: string
}

export const useBookings = () => {
	return useQuery<Booking[]>({
		queryKey: ['bookings'],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`/v1/bookings?service_id=${
					// @ts-ignore
					import.meta.env.VITE_RESERVEKIT_SERVICE_ID
				}`,
			)
			return data
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
	})
}
