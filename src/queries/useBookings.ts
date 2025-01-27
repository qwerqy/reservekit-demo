import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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
			const { data } = await axios.get('YOUR_API_URL/bookings')
			return data
		},
	})
}
