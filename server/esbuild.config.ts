import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['./index.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'esm',
    packages: 'external',
    minify: true,
    sourcemap: false,
    metafile: false,
    logLevel: 'info',
});

console.log('Build completed!');