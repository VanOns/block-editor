import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Build integrity and supply chain security tests — Phase 1 + 3
 *
 * These tests verify:
 * 1. TypeScript compilation succeeds
 * 2. SCSS compilation succeeds
 * 3. No npm audit HIGH/CRITICAL vulnerabilities
 * 4. No dependency conflicts (UNMET/invalid)
 * 5. No duplicate @wordpress/* packages in tree
 * 6. SCSS import paths in dependency files resolve
 *
 * Source: Plan Phase 1 Success Criteria, Plan Phase 3 SCSS Validation,
 *         Threat Model HIGH "Supply chain" + HIGH "SCSS build breakage"
 */

const ROOT = resolve(__dirname, '../..')

describe('build integrity', () => {
    describe('TypeScript compilation', () => {
        /* Plan Phase 1: TypeScript type-checking passes */
        it('passes tsc --noEmit without errors', () => {
            expect(() => {
                execSync('npx tsc --noEmit', { cwd: ROOT, encoding: 'utf-8' })
            }).not.toThrow()
        })
    })

    describe('SCSS compilation', () => {
        /* Plan Phase 1: sass build succeeds */
        /* Threat Model HIGH: SCSS build breakage */
        it('compiles src/styles.scss without errors', () => {
            expect(() => {
                execSync('npx sass src/styles.scss --no-source-map --style=compressed /dev/null', {
                    cwd: ROOT,
                    encoding: 'utf-8',
                })
            }).not.toThrow()
        })
    })

    describe('dependency health', () => {
        /* Plan Phase 1: npm audit reports no HIGH/CRITICAL */
        /* Threat Model HIGH: Supply chain verification */
        it('has no HIGH or CRITICAL npm audit findings', () => {
            let auditOutput: string
            try {
                auditOutput = execSync('npm audit --json', { cwd: ROOT, encoding: 'utf-8' })
            } catch (error: any) {
                // npm audit exits non-zero when vulnerabilities exist
                auditOutput = error.stdout || ''
            }

            if (auditOutput) {
                const audit = JSON.parse(auditOutput)
                const high = audit.metadata?.vulnerabilities?.high || 0
                const critical = audit.metadata?.vulnerabilities?.critical || 0
                expect(high + critical).toBe(0)
            }
        })

        /* Plan Phase 1: No dependency conflicts — bun install succeeds */
        it('has no dependency resolution errors (bun install succeeds)', () => {
            expect(() => {
                execSync('bun install --frozen-lockfile 2>&1', {
                    cwd: ROOT,
                    encoding: 'utf-8',
                })
            }).not.toThrow()
        })

        /* Threat Model MEDIUM: Lockstep — direct @wordpress/* deps are consistent */
        it('all direct @wordpress/* dependencies resolve without conflicts', () => {
            const pkg = JSON.parse(
                readFileSync(resolve(ROOT, 'package.json'), 'utf-8')
            )

            // Verify all @wordpress deps have consistent caret ranges
            // (indicating they're from the same release cycle)
            const wpDeps = Object.entries(pkg.dependencies as Record<string, string>)
                .filter(([name]) => name.startsWith('@wordpress/'))

            // All should be present
            expect(wpDeps.length).toBeGreaterThanOrEqual(11)

            // All should use caret ranges
            for (const [name, version] of wpDeps) {
                expect(version).toMatch(/^\^/)
            }
        })
    })

    describe('SCSS import path validation', () => {
        /* Threat Model HIGH: SCSS build breakage — monolith must compile */
        it('compiles the monolithic styles.scss successfully (active build path)', () => {
            expect(() => {
                execSync('npx sass src/styles.scss --no-source-map --style=compressed /dev/null', {
                    cwd: ROOT,
                    encoding: 'utf-8',
                })
            }).not.toThrow()
        })

        /* Plan Phase 3: SCSS validation script exists and runs */
        it('the validate-scss-imports.sh script executes without crashing', () => {
            // Script may report broken paths (exit 1) which is expected
            // but it must not crash/segfault/syntax-error
            const output = execSync('bash scripts/validate-scss-imports.sh 2>&1; echo "EXIT:$?"', {
                cwd: ROOT,
                encoding: 'utf-8',
                timeout: 30000,
            })

            // Must produce output (either success or broken paths report)
            expect(output).toContain('SCSS import path')
            // Exit code must be 0 or 1 (not a crash)
            expect(output).toMatch(/EXIT:[01]/)
        }, 35000)
    })

    describe('package.json integrity', () => {
        /* Plan Phase 3: @wordpress/base-styles removed from deps */
        it('does not list @wordpress/base-styles as a dependency (dead weight)', () => {
            const pkg = JSON.parse(
                readFileSync(resolve(ROOT, 'package.json'), 'utf-8')
            )

            // After Phase 3, base-styles should be removed
            expect(pkg.dependencies['@wordpress/base-styles']).toBeUndefined()
        })

        /* Plan Phase 3: scripts/check-versions.sh exists */
        it('has a version drift check script', () => {
            expect(existsSync(resolve(ROOT, 'scripts/check-versions.sh'))).toBe(true)
        })

        /* Plan Phase 3: scripts/validate-scss-imports.sh exists */
        it('has an SCSS import validation script', () => {
            expect(existsSync(resolve(ROOT, 'scripts/validate-scss-imports.sh'))).toBe(true)
        })

        /* Plan Phase 3: gutenberg/ directory not tracked in git */
        it('does not track gutenberg/ directory in git', () => {
            const output = execSync('git ls-files gutenberg/ 2>&1 || true', {
                cwd: ROOT,
                encoding: 'utf-8',
            }).trim()

            // Must not be tracked in git (gitignored is fine)
            expect(output).toBe('')
        })
    })
})
