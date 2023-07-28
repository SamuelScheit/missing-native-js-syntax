import type { PluginConfig, ProgramTransformerExtras, TransformerExtras } from "ts-patch";
import ts, { CompilerHost, CompilerOptions, SourceFile } from "typescript";
import { transformFile } from "./transformFile";


function getPatchedHost(
	maybeHost: CompilerHost | undefined,
	tsInstance: typeof ts,
	compilerOptions: CompilerOptions
): CompilerHost & { fileCache: Map<string, SourceFile> } {
	const fileCache = new Map();
	const compilerHost = maybeHost ?? tsInstance.createCompilerHost(compilerOptions, true);
	const originalGetSourceFile = compilerHost.getSourceFile;

	return Object.assign(compilerHost, {
		getSourceFile(fileName: string, languageVersion: ts.ScriptTarget) {
			// console.log("getSourceFile", fileName)
			if (fileCache.has(fileName)) return fileCache.get(fileName);

			const sourceFile = originalGetSourceFile.apply(void 0, Array.from(arguments) as any);
			fileCache.set(fileName, sourceFile);

			return sourceFile;
		},
		fileCache
	});
}

function transformProgram(program: ts.Program, host: CompilerHost | undefined, config: PluginConfig, extras: ProgramTransformerExtras) {
	const compilerOptions = program.getCompilerOptions();
	const compilerHost = getPatchedHost(host, extras.ts, compilerOptions);
	const rootFileNames = program.getRootFileNames()

	const transformed = extras.ts.transform(program.getSourceFiles() as SourceFile[], [(ctx) => (node) => transformFile(node, ctx)], compilerOptions)

	const { printFile } = extras.ts.createPrinter();
	for (const sourceFile of transformed.transformed) {
		const { fileName, languageVersion } = sourceFile; // @ts-ignore
		const updatedSourceFile = extras.ts.createSourceFile(fileName, printFile(sourceFile), languageVersion, undefined, undefined, program.getCompilerOptions)
		compilerHost.fileCache.set(fileName, updatedSourceFile);
	}

	return extras.ts.createProgram(rootFileNames, compilerOptions, compilerHost, program);
}

module.exports = transformProgram;


