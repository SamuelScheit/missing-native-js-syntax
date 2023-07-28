import type { LanguageService, server } from "typescript/lib/tsserverlibrary";

function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
	const ts = modules.typescript;

	function create(info: server.PluginCreateInfo) {

		// Diagnostic logging
		info.project.projectService.logger.info("I'm getting set up now! Check the log for this message.");

		// Set up decorator object
		const proxy: LanguageService = Object.create(null);
		for (let k of Object.keys(info.languageService) as Array<keyof LanguageService>) {
			const x = info.languageService[k]!;
			proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
		}

		// let cache: Program | undefined;

		// proxy.getProgram = () => {
		// 	const program = info.languageService.getProgram();
		// 	if (cache === program) return cache;
		// 	cache = transformProgram(program, undefined)
		// 	info.project.projectService.logger.info("Program: " + cache.getNodeCount())
		// 	info.project.projectService.logger.info("Program: " + cache.getRootFileNames().join(" "))
		// 	return cache;
		// }

		// proxy.getSyntacticDiagnostics = (...args) => {
		// 	proxy.getProgram().emit()
		// 	info.project.projectService.logger.info("Syntactic Diagnostics params " + JSON.stringify(args));
		// 	const diagnostics = info.languageService.getSyntacticDiagnostics(...args)
		// 	// {"start":22,"length":6,"messageText":"'(' expected.","category":1,"code":1005}
		// 	const y = diagnostics.filter(x => x.code !== 1005 || x.length !== 6 || x.messageText !== "'(' expected." || x.category !== 1)
		// 	info.project.projectService.logger.info("Syntactic Diagnostics: " + JSON.stringify(diagnostics.map(x => ({ ...x, file: undefined }))));

		// 	return (y as DiagnosticWithLocation[])
		// }

		// proxy.getSyntacticDiagnostics = (fileName) => {
		// 	const program = proxy.getProgram();
		// 	const x = program.getSyntacticDiagnostics(program.getSourceFile(fileName))
		// 	info.project.projectService.logger.info("Syntactic Diagnostics: " + JSON.stringify(x));
		// 	return x as DiagnosticWithLocation[]
		// }

		// proxy.getSemanticDiagnostics = (fileName) => {
		// 	const program = proxy.getProgram();
		// 	const x = program.getSemanticDiagnostics(program.getSourceFile(fileName))
		// 	info.project.projectService.logger.info("Semantic Diagnostics: " + JSON.stringify(x));
		// 	return x as Diagnostic[]
		// }

		// Remove specified entries from completion list
		// proxy.getCompletionsAtPosition = (fileName, position, options) => {
		// 	// This is just to let you hook into something to
		// 	// see the debugger working

		// 	var prior = info.languageService.getCompletionsAtPosition(fileName, position, options);
		// 	if (!prior) prior = { entries: [], isGlobalCompletion: true, isMemberCompletion: false, isNewIdentifierLocation: false, }

		// 	const name = "test1" + info.languageService.getProgram().getRootFileNames().join(" ");

		// 	prior.entries.push({
		// 		name,
		// 		kind: ts.ScriptElementKind.variableElement,
		// 		kindModifiers: "",
		// 		sortText: "0",
		// 		insertText: name,
		// 		replacementSpan: undefined,
		// 		hasAction: true,
		// 		source: undefined,
		// 		isRecommended: true,
		// 	});

		// 	return prior;
		// };

		return new Proxy(info.languageService, {
			get(target, prop, receiver) {
				const x = Reflect.get(target, prop, receiver)
				if (typeof x === "function") {
					return (...args: any[]) => {
						const result = x.apply(target, args)
						if (result) {
							info.project.projectService.logger.info("Proxy: " + String(prop) + " " + JSON.stringify(args) + " " + JSON.stringify(result))
						}
						return result
					}
				}
				return x
			}
		})
	}

	return { create };
}

module.exports = init;
