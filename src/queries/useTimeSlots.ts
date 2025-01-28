import { useQuery } from '@tanstack/react-query'
import { useAxiosWithToken } from '../axiosInstance'

export interface TimeSlot {
	data: {
		time_slots: {
			id: string
			start_time: string
			end_time: string
			max_bookings: boolean
			day_of_week: number
		}[]
	}
}

export const useTimeSlots = () => {
	const axios = useAxiosWithToken()

	return useQuery<TimeSlot>({
		queryKey: ['timeSlots'],
		queryFn: async () => {
			const { data } = await axios.get(
				`/v1/time-slots?service_id=${
					// @ts-ignore
					import.meta.env.VITE_RESERVEKIT_SERVICE_ID
				}`,
			)
			return data
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
	})
}
