import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAxiosWithToken } from '../axiosInstance'
import { Appointment } from '../App'

interface CreateBookingData extends Appointment {}

export const useCreateBooking = () => {
	const axios = useAxiosWithToken()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (bookingData: CreateBookingData) => {
			const { data } = await axios.post(
				`/v1/bookings?service_id=${
					// @ts-ignore
					import.meta.env.VITE_RESERVEKIT_SERVICE_ID
				}`,
				bookingData,
			)
			return data
		},
		onSuccess: () => {
			// Invalidate the bookings query to refetch the updated list
			queryClient.invalidateQueries({ queryKey: ['bookings'] })
		},
	})
}
