import { useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceClient } from '../reservekit-client'

import { CreateBookingPayload } from 'reservekitjs'

export const useCreateBooking = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (bookingData: CreateBookingPayload) => {
			const service = await serviceClient()
			return service?.createBooking(bookingData as CreateBookingPayload)
		},
		onSuccess: () => {
			// Invalidate the bookings query to refetch the updated list
			queryClient.invalidateQueries({ queryKey: ['bookings'] })
		},
	})
}
