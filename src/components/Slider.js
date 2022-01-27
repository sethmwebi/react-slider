import { useState, useEffect, useRef } from "react";
import { css, jsx } from "@emotion/react";
import SliderContent from "./SliderContent";
import Slide from "./Slide";
import Arrow from "./Arrow";
import Dots from "./Dots";

const getWidth = () => window.innerWidth;

const Slider = ({ slides, autoPlay }) => {
	const firstSlide = slides[0];
	const secondSlide = slides[1];
	const lastSlide = slides[slides.length - 1];

	const [state, setState] = useState({
		activeSlide: 0,
		translate: getWidth(),
		transition: 0.45,
		_slides: [lastSlide, firstSlide, secondSlide]
	});

	const { translate, transition, activeSlide, _slides } = state;
	const autoPlayRef = useRef()
	const transitionRef = useRef()

	useEffect(() => {
		autoPlayRef.current = nextSlide;
		transitionRef.current = smoothTransition;
	})

	useEffect(() => {
		const play = () => {
			autoPlayRef.current()
		}

		const smooth = (e) => {
			if(e.target.className.includes("SliderContent")){
				transitionRef.current()
			}
		}

		let interval = null;

		const transitionEnd = window.addEventListener("transitionend", smooth);

		if(autoPlay){	
			interval = setInterval(play, autoPlay * 1000)
		}

		return () => {
			window.removeEventListener("transitionend", transitionEnd);

			if(autoPlay){
				clearInterval(interval)
			}
		}
	},[autoPlay])

	useEffect(() => {
		if(transition === 0) setState({ ...state, transition: 0.45})
	},[transition])

	const smoothTransition = () => {
		let _slides = [];

		if(activeSlide === slides.length - 1)
			_slides = [slides[slides.length - 2], lastSlide, firstSlide]
		else if (activeSlide === 0) 
			_slides = [lastSlide, firstSlide, secondSlide]
		else 
			_slides = slides.slice(activeSlide - 1, activeSlide + 2)

		setState({
			...state,
			transition: 0,
			translate: getWidth()
		})
	}

	const nextSlide = () => {
		setState({
			...state,
			translate: translate + getWidth(),
			activeSlide: activeSlide === slides.length - 1 ? 0 : activeSlide + 1
		})
	}

	const prevSlide = () => {
		setState({
			...state,
			translate: 0,
			activeSlide: activeSlide === 0 ? slides.length - 1 : activeSlide - 1
		})
	}
	return (
		<div style={SliderCSS}>
			<SliderContent
				translate={translate}
				transition={transition}
				width={getWidth() * _slides.length}
			>
				{_slides.map((slide) => (
					<Slide key={slide} content={slide} />
				))}
			</SliderContent>
			{!autoPlay && (
				<>
					<Arrow direction="right" handleClick={prevSlide} />
					<Arrow direction="left" handleClick={nextSlide} />
				</>
			)}

			<Dots slides={slides} activeSlide={activeSlide} />
		</div>
	);
};

Slider.defaultProps = {
	slides: [],
	autoPlay: null,
};

const SliderCSS = css`
  position: relative,
  height: 100%,
  width: 100%,
  margin: 0 auto,
  overflow: hidden!important
`;

export default Slider;
