import easeOut from './easings';

type SideType = 'top' | 'bottom' | 'right' | 'left';

interface FadeInSlideTransitionOptions {
	side?: SideType;
	duration?: number;
	easing?: (t: number) => number;
	percentage?: number;
}

export default function fadeInSlide(
	_node: Element,
	{
		duration = 300,
		easing = easeOut,
		percentage = 30,
		side = 'top'
	}: FadeInSlideTransitionOptions = {}
) {
	percentage = side === 'left' || side === 'top' ? -percentage : percentage;
	const translateSide = side === 'top' || side === 'bottom' ? 'Y' : 'X';

	return {
		duration: duration,
		css: (t: number) => {
			return `opacity: ${easing(t)}; transform: translate${translateSide}(${percentage * easing(1 - t)}%);
        `;
		}
	};
}
