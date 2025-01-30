import { useQuery } from '@tanstack/react-query'
import { serviceClient } from '../reservekit-client'
import { IService } from 'reservekitjs'

export const useService = () => {
	return useQuery<IService | undefined>({
		queryKey: ['services', import.meta.env.VITE_RESERVEKIT_SERVICE_ID],
		queryFn: async () => {
			const service = await serviceClient()

			return service as IService
		},
	})
}
