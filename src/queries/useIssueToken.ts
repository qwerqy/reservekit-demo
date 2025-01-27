import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

interface Token {
	data: string
}

export const useIssueToken = (
	opts?: Omit<UndefinedInitialDataOptions<Token>, 'queryKey' | 'queryFn'>,
) => {
	return useQuery<Token>({
		...opts,
		queryKey: ['token'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/v1/issue-api-key')
			return data
		},
		staleTime: 1000 * 60 * 14, // 14 minutes (refresh 1 minute before expiration)
	})
}
