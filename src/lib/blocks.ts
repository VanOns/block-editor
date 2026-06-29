import { getBlockTypes } from '@wordpress/blocks'
// @ts-ignore — no type declarations for these exports
import * as blockLibrary from '@wordpress/block-library'

const { registerCoreBlocks } = blockLibrary

interface CoreBlock {
	name: string
	init: () => void
	metadata: Record<string, unknown>
	settings: Record<string, unknown>
}

/**
 * Safely retrieve core blocks using the experimental API.
 * Falls back to null if the API is unavailable (removed in a future version).
 */
function getAvailableCoreBlocks(): CoreBlock[] | null {
	try {
		const experimentalFn = (blockLibrary as any).__experimentalGetCoreBlocks
		if (typeof experimentalFn === 'function') {
			return experimentalFn()
		}
		return null
	} catch {
		return null
	}
}

/**
 * Register all supported core blocks that are not registered yet and are not disabled in the settings
 *
 * @param disabledCoreBlocks
 */
function registerBlocks(disabledCoreBlocks: string[] = []) {
	const allBlocks = getAvailableCoreBlocks()

	if (allBlocks === null) {
		// Fallback: register all core blocks without filtering
		// This means disabledCoreBlocks setting won't work, but editor won't crash
		console.warn(
			'[BlockEditor] __experimentalGetCoreBlocks is unavailable. ' +
			'Registering all core blocks without filtering.'
		)
		registerCoreBlocks()
		return
	}

	registerCoreBlocks(
		filterRegisteredBlocks(
			getCoreBlocks(allBlocks, disabledCoreBlocks)
		)
	)
}

/**
 * Remove blocks that are already registered from an array of blocks
 *
 * @param blocks
 */
function filterRegisteredBlocks(blocks: CoreBlock[]) {
	const registeredBlockNames = getBlockTypes().map(b => b.name)
	return blocks.filter(b => !registeredBlockNames.includes(b.name))
}

/**
 * Get all supported core blocks except for the ones disabled through settings
 *
 * @param allBlocks
 * @param disabledCoreBlocks
 */
export const getCoreBlocks = (allBlocks: CoreBlock[], disabledCoreBlocks: string[] = []): CoreBlock[] => {
	return allBlocks.filter(b => !disabledCoreBlocks.includes(b.name))
}

export { registerBlocks }
