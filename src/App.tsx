import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useService } from './queries/useService'
import { TimeSlot, useTimeSlots } from './queries/useTimeSlots'
import { useCreateBooking } from './mutations/useCreateBooking'

export interface Appointment {
	customer_name?: string
	customer_email?: string
	customer_phone?: string
	date: string
	time_slot_id: number | null
}

function App() {
	const [appointment, setAppointment] = useState<Appointment>({
		customer_name: '',
		customer_email: '',
		customer_phone: '',
		date: '',
		time_slot_id: null,
	})

	const [filteredTimeSlots, setFilteredTimeSlots] = useState<
		TimeSlot['data']['time_slots'] | null
	>(null)
	const { data: service } = useService()
	const { data: timeSlots } = useTimeSlots()
	const { mutate: createBooking, error } = useCreateBooking()

	useEffect(() => {
		if (timeSlots?.data?.time_slots && appointment.date) {
			console.log(
				timeSlots.data.time_slots.filter(timeSlot => {
					console.log(timeSlot.day_of_week)
					return (
						timeSlot.day_of_week === new Date(appointment.date).getDay() - 1
					)
				}),
			)
			setFilteredTimeSlots(
				timeSlots.data.time_slots.filter(
					timeSlot =>
						timeSlot.day_of_week === new Date(appointment.date).getDay() - 1,
				),
			)
		}
	}, [timeSlots, appointment.date])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		appointment.time_slot_id = Number(appointment.time_slot_id)
		console.log(appointment)
		createBooking(appointment, {
			onSuccess: () => {
				alert('Appointment scheduled successfully!')
			},
		})
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setAppointment(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					{service?.data.name}
				</h1>
				<p className="text-sm text-gray-600 mb-6 text-center">
					{service?.data.description}
				</p>
				<form onSubmit={handleSubmit} className="space-y-6">
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
							name="customer_name"
							value={appointment.customer_name}
							onChange={handleChange}
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
							name="customer_email"
							value={appointment.customer_email}
							onChange={handleChange}
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
							name="customer_phone"
							value={appointment.customer_phone}
							onChange={handleChange}
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
							name="date"
							required
							min={format(new Date(), 'yyyy-MM-dd')}
							value={appointment.date}
							onChange={handleChange}
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
							name="time_slot_id"
							required
							value={appointment.time_slot_id?.toString() ?? ''}
							onChange={handleChange}
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
