import easeOut from './easings';

type SideType = 'top' | 'bottom' | 'right' | 'left';

interface FadeOutSlideTransitionOptions {
	side?: SideType;
	duration?: number;
	easing?: (t: number) => number;
	percentage?: number;

	// * Another animation combined
	// * Squashes Vertically
	height_squish?: boolean;
	margin_top_squish?: boolean;
	initial_height?: number;
	initial_margin_top?: number;
}

export default function fadeOutSlide(
	_node: Element,
	{
		duration = 300,
		easing = easeOut,
		percentage = 30,
		side = 'top',

		height_squish = false,
		initial_height = 0,

		margin_top_squish = false,
		initial_margin_top = 0
	}: FadeOutSlideTransitionOptions = {}
) {
	percentage = side === 'left' || side === 'top' ? -percentage : percentage;
	const translateSide = side === 'top' || side === 'bottom' ? 'Y' : 'X';

	return {
		duration: duration,
		css: (t: number) => {
			let data = `opacity: ${easing(t)}; transform: translate${translateSide}(${percentage * easing(1 - t)}%);`;
			data += height_squish && initial_height ? ` height: ${initial_height * easing(t)}px;` : '';
			data +=
				margin_top_squish && initial_margin_top
					? ` margin-top: ${initial_margin_top * easing(t)}rem;`
					: '';
			return data;
		}
	};
}
