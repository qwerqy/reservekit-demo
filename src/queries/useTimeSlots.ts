import { useQuery } from '@tanstack/react-query'
import { serviceClient } from '../reservekit-client'
import { ITimeSlot } from 'reservekitjs'

export const useTimeSlots = () => {
	return useQuery<ITimeSlot[] | undefined>({
		queryKey: ['timeSlots'],
		queryFn: async () => {
			const service = await serviceClient()
			const timeSlots = await service?.getTimeSlots()
			return timeSlots
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
	})
}
