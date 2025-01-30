import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useService } from './queries/useService'
import { useTimeSlots } from './queries/useTimeSlots'
import { useCreateBooking } from './mutations/useCreateBooking'
import { ITimeSlot } from 'reservekitjs'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	customer_phone: z.string().optional(),
	date: z.string().date(),
	time_slot_id: z.string().transform(val => Number(val)),
})

function App() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const [filteredTimeSlots, setFilteredTimeSlots] = useState<
		ITimeSlot[] | null
	>(null)
	const { data: service } = useService()
	const { data: timeSlots } = useTimeSlots()
	const { mutate: createBooking, error } = useCreateBooking()

	const { date } = useWatch({
		control: form.control,
	})

	console.log(service)

	useEffect(() => {
		if (timeSlots && date) {
			setFilteredTimeSlots(
				timeSlots.filter(
					timeSlot =>
						timeSlot.day_of_week ===
						new Date(date as unknown as Date).getDay() - 1,
				),
			)
		}
	}, [timeSlots, date])

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		createBooking(values, {
			onSuccess: () => {
				alert('Appointment scheduled successfully!')
			},
		})
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					{service?.name}
				</h1>
				<p className="text-sm text-gray-600 mb-6 text-center">
					{service?.description}
				</p>

				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="customer_name"
							className="block text-sm font-medium text-gray-700"
						>
							Full Name
						</label>
						<input
							type="text"
							id="customer_name"
							{...form.register('customer_name')}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="customer_email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="customer_email"
							{...form.register('customer_email')}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="customer_phone"
							className="block text-sm font-medium text-gray-700"
						>
							Phone
						</label>
						<input
							type="tel"
							id="customer_phone"
							{...form.register('customer_phone')}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700"
						>
							Date
						</label>
						<input
							type="date"
							id="date"
							{...form.register('date')}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="time_slot_id"
							className="block text-sm font-medium text-gray-700"
						>
							Time
						</label>
						<select
							id="time_slot_id"
							{...form.register('time_slot_id')}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						>
							<option value="">Select a time slot</option>
							{filteredTimeSlots?.map(timeSlot => (
								<option key={timeSlot.id} value={timeSlot.id}>
									{format(new Date(timeSlot.start_time), 'h:mm a')} -{' '}
									{format(new Date(timeSlot.end_time), 'h:mm a')}
								</option>
							))}
						</select>
					</div>

					{error && (
						<p className="text-red-500">
							{/* @ts-ignore */}
							{error.message}: {error.response?.data?.error}
						</p>
					)}

					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Schedule Appointment
					</button>
				</form>
			</div>
		</div>
	)
}

export default App
