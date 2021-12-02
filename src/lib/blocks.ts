import { getBlockTypes } from '@wordpress/blocks'
import { registerCoreBlocks } from '@wordpress/block-library'

import * as paragraph from '@wordpress/block-library/build-module/paragraph'
import * as image from '@wordpress/block-library/build/image'
import * as heading from '@wordpress/block-library/build/heading'
import * as quote from '@wordpress/block-library/build/quote'
import * as gallery from '@wordpress/block-library/build/gallery'
import * as audio from '@wordpress/block-library/build/audio'
import * as buttons from '@wordpress/block-library/build/buttons'
import * as button from '@wordpress/block-library/build/button'
import * as code from '@wordpress/block-library/build/code'
import * as columns from '@wordpress/block-library/build/columns'
import * as column from '@wordpress/block-library/build/column'
import * as cover from '@wordpress/block-library/build/cover'
import * as file from '@wordpress/block-library/build/file'
import * as html from '@wordpress/block-library/build/html'
import * as mediaText from '@wordpress/block-library/build/media-text'
import * as list from '@wordpress/block-library/build/list'
import * as missing from '@wordpress/block-library/build/missing'

import * as preformatted from '@wordpress/block-library/build/preformatted'
import * as pullquote from '@wordpress/block-library/build/pullquote'
import * as group from '@wordpress/block-library/build/group'
import * as separator from '@wordpress/block-library/build/separator'
import * as spacer from '@wordpress/block-library/build/spacer'
import * as table from '@wordpress/block-library/build/table'
import * as textColumns from '@wordpress/block-library/build/text-columns'
import * as verse from '@wordpress/block-library/build/verse'
import * as video from '@wordpress/block-library/build/video'
import * as socialLinks from '@wordpress/block-library/build/social-links'
import * as socialLink from '@wordpress/block-library/build/social-link'

import * as embed from '@wordpress/block-library/build/embed'
import * as classic from '@wordpress/block-library/build/freeform'
import * as archives from '@wordpress/block-library/build/archives'
import * as more from '@wordpress/block-library/build/more'
import * as nextpage from '@wordpress/block-library/build/nextpage'
import * as calendar from '@wordpress/block-library/build/calendar'
import * as categories from '@wordpress/block-library/build/categories'
import * as reusableBlock from '@wordpress/block-library/build/block'
import * as rss from '@wordpress/block-library/build/rss'
import * as search from '@wordpress/block-library/build/search'
import * as shortcode from '@wordpress/block-library/build/shortcode'
import * as tagCloud from '@wordpress/block-library/build/tag-cloud'

/**
 * Register all supported core blocks that are not registered yet and are not disabled in the settings
 *
 * @param disabledCoreBlocks
 */
function registerBlocks(disabledCoreBlocks: string[] = []) {
	registerCoreBlocks(
		filterRegisteredBlocks(
			getCoreBlocks(disabledCoreBlocks)
		)
	)
}

/**
 * Remove blocks that are already registered from an array of blocks
 *
 * @param blocks
 */
function filterRegisteredBlocks(blocks: any[]) {
	const registredBlockNames = getBlockTypes().map(b => b.name)
	return blocks.filter(b => !registredBlockNames.includes(b.name))
}

/**
 * Get all supported core blocks except for the ones disabled through settings
 *
 * @param disabledCoreBlocks
 */
export const getCoreBlocks = (disabledCoreBlocks: string[] = []) => {
	return CORE_BLOCKS.filter(b => !disabledCoreBlocks.includes(b.name))
}

const CORE_BLOCKS = [
	// Common blocks are grouped at the top to prioritize their display
	// in various contexts — like the inserter and auto-complete components.
	paragraph,
	image,
	heading,
	gallery,
	list,
	quote,

	// Register all remaining core blocks.
	audio,
	button,
	buttons,
	code,
	columns,
	column,
	cover,
	file,
	group,
	html,
	mediaText,
	missing,
	preformatted,
	pullquote,
	separator,
	socialLinks,
	socialLink,
	spacer,
	table,
	textColumns,
	verse,
	video,

	embed,
	classic,
	shortcode,
	archives,
	tagCloud,
	reusableBlock,
	rss,
	search,
	calendar,
	categories,
	more,
	nextpage,
]

export { registerBlocks }
