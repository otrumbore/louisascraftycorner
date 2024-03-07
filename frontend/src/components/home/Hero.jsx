import React, { useEffect, useState } from 'react';
import DefaultImage from '../../assets/product-img/default.png';
import { useNavigate } from 'react-router-dom';

const Hero = ({ data }) => {
	const [heroData, setHeroData] = useState({
		hero1: null,
		hero2: null,
		hero3: null,
	});
	const navigate = useNavigate();

	useEffect(() => {
		const updatedHeroData = data.reduce((acc, hero) => {
			if (hero.active) {
				acc[hero.name] = hero;
			}
			return acc;
		}, {});

		setHeroData(updatedHeroData);
	}, []);

	const goShopping = (link) => {
		navigate(link);
	};

	const renderHero2 = () => {
		if (!heroData.hero2) return null;
		return (
			<div
				className={`w-full ${
					heroData.hero3 ? 'lg:w-1/2' : ''
				} bg-yellow-100 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly`}
			>
				<img
					src={heroData.hero2.image || DefaultImage}
					className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-64'
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = DefaultImage;
					}}
				/>
				<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
					<div className='flex w-full justify-center'>
						<h3 className='text-3xl flex-wrap'>{heroData.hero2.title}</h3>
					</div>

					<p
						className='mt-4 text-lg text-center'
						dangerouslySetInnerHTML={{ __html: heroData.hero2.data }}
					></p>
					<div className='mt-4 flex w-full justify-center'>
						<button
							onClick={() => goShopping(heroData.hero2.link)}
							className='mt-4 px-8 py-3 btn-outline'
						>
							Shop Now
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderHero3 = () => {
		if (!heroData.hero3) return null;
		return (
			<div
				className={`w-full ${
					heroData.hero2 ? 'lg:w-1/2' : ''
				} bg-blue-200 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly`}
			>
				<img
					src={heroData.hero3.image || DefaultImage}
					className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-64'
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = DefaultImage;
					}}
				/>
				<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
					<div className='flex w-full justify-center'>
						<h3 className='text-3xl flex-wrap'>{heroData.hero3.title}</h3>
					</div>

					<p
						className='mt-4 text-lg text-center'
						dangerouslySetInnerHTML={{ __html: heroData.hero3.data }}
					></p>
					<div className='mt-4 flex w-full justify-center'>
						<button
							onClick={() => goShopping(heroData.hero3.link)}
							className='mt-4 px-8 py-3 btn-outline'
						>
							Shop Now
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='w-full flex justify-center'>
			<div className='w-full max-w-[2400px] lg:h-[40%] flex flex-col gap-8 items-center justify-center'>
				{heroData.hero1 ? (
					<div className='w-[90vw] bg-green-200 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly'>
						<img
							src={heroData.hero1.image || DefaultImage}
							className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-96'
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = DefaultImage;
							}}
						/>
						<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
							<div className='flex w-full justify-center'>
								<h3 className='text-3xl flex-wrap'>{heroData.hero1.title}</h3>
							</div>

							<p
								className='mt-4 text-lg text-center'
								dangerouslySetInnerHTML={{ __html: heroData.hero1.data }}
							></p>
							<div className='mt-4 flex w-full justify-center'>
								<button
									onClick={() => goShopping(heroData.hero1.link)}
									className='mt-4 px-8 py-3 btn'
								>
									Shop Now
								</button>
							</div>
						</div>
					</div>
				) : null}

				<div className='w-[90vw] flex flex-col lg:flex-row gap-8'>
					{renderHero2()}
					{renderHero3()}
				</div>

				{/* <img
					src={HeroPic}
					className='object-cover w-full h-full glass opacity-80'
				/>
				{/* promo text over the image hero
				<div className='absolute flex w-full lg:w-[35%] left-0 lg:left-[33%] top-[30%] lg:top-[30%]'>
					<div className='absolute p-6 flex flex-col items-center gap-y-4 lg:items-start w-full bg-slate-300 bg-opacity-50 text-gray-900 border-4 border-primary rounded-xl'>
						<div className='flex w-full justify-center'>
							<h3 className='text-3xl flex-wrap'>🌷Spring Has Sprung!🌻</h3>
						</div>

						<p className='text-lg'>
							Dive into a world of creativity with our exclusive hand-crafted
							creations. From stunning floral-themed artworks to intricately
							designed home decor, our collection embodies the beauty of spring!
						</p>
						<div className='flex w-full justify-end'>
							<button
								onClick={() => goShopping()}
								className='mt-4 px-8 py-3 btn'
							>
								Shop Now
							</button>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Hero;
