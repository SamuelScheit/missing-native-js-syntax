import ts, { CompilerHost, CompilerOptions, SourceFile } from "typescript";
import type { PluginConfig, ProgramTransformerExtras, TransformerExtras } from "ts-patch";
import { transformFile } from "./transformFile";

// transform files
function transformFiles(program: ts.Program, pluginConfig: PluginConfig, extras: TransformerExtras) {
	for (const i in extras.diagnostics) {
		extras.removeDiagnostic(+i)
	}

	return (ctx: ts.TransformationContext) => {

		return (file: ts.SourceFile) => transformFile(file, ctx)
	};
}

module.exports = transformFiles;
