import { ReserveKit } from 'reservekitjs'

const reserveKitClient = new ReserveKit(
	import.meta.env.VITE_RESERVEKIT_API_KEY,
	{
		host: import.meta.env.VITE_API_URL,
	},
)

export const serviceClient = async () => {
	if (!reserveKitClient.service) {
		await reserveKitClient.initService(
			import.meta.env.VITE_RESERVEKIT_SERVICE_ID,
		)
	}
	return reserveKitClient.service
}
