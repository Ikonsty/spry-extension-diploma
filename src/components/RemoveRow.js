import React, { useState } from 'react';
import Close from '../../dist/images/close.svg'

function RemoveRow({ hoveredRow, idx, removeField }) {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<>
			{hoveredRow === idx && (
				<td className={`py-2 relative transform -translate-x-4`}>
					<div
						className='bg-[#D9D9D9] w-[5px] h-6 rounded-lg hover:w-6 transition duration-300 ease transform hover:translate-x-[-10px]'
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						{isHovered && (
							<button
								className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
								onClick={() => removeField(idx)}
							>
								<img src={Close}
									style={{
										color: '#1A6DFF',
										height: '1.5rem',
										width: '1.5rem',
									}}
								/>
							</button>
						)}
					</div>
				</td>
			)}
		</>
	);
}

export default RemoveRow;
