import { MdClose } from 'react-icons/md';

export default function Banner({ style }) {
	return (
		<div
			className={`w-full top-0 left-0 flex items-center gap-x-6 overflow-hidden bg-primary bg-opacity-60 px-5 py-2 sm:px-3 sm:before:flex-1 z-50 ${style}`}
		>
			<div className='flex flex-wrap w-full max-w-[1200px] items-center justify-center gap-x-4 gap-y-2'>
				<p className='text-sm leading-6 text-white'>
					<strong className='font-semibold'>Website Under Development</strong>
					<svg
						viewBox='0 0 2 2'
						className='mx-2 inline h-01 w-1 fill-current'
						aria-hidden='true'
					>
						<circle cx={1} cy={1} r={1} />
					</svg>
					Now accepting orders!
				</p>
				{/* <a
					href='#'
					className='flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
				>
					Register now <span aria-hidden='true'>&rarr;</span>
				</a> */}
			</div>
			<div className='hidden lg:flex flex-1 justify-end'>
				<button
					type='button'
					className='hidden -m-3 p-3 focus-visible:outline-offset-[-4px]'
				>
					<span className='sr-only'>Dismiss</span>
					<MdClose className='h-5 w-5 text-gray-900' aria-hidden='true' />
				</button>
			</div>
		</div>
	);
}
