// Set globals required by Gutenberg packages outside WordPress
// Uses globalThis per Gutenberg v13+ requirement (replaces process.env pattern)

// Gutenberg phase flags (globalThis pattern for v13+)
;(globalThis as any).IS_GUTENBERG_PLUGIN = false
;(globalThis as any).IS_WORDPRESS_CORE = false
;(globalThis as any).SCRIPT_DEBUG = false

// Legacy window.process.env shim (still needed by some transitive deps)
if (typeof window !== 'undefined') {
    ;(window as any).process = (window as any).process || {}
    ;(window as any).process.env = (window as any).process.env || {}
    ;(window as any).process.env.FORCE_REDUCED_MOTION = false

    // Initialize window.wp namespace
    ;(window as any).wp = (window as any).wp || {}
}
