import ts from "typescript";

export function transformFile(sourceFile: ts.SourceFile, ctx: ts.TransformationContext, tsx: typeof ts = ts) {
	const { factory } = ctx;

	function visit(node: ts.Node) {
		/*
			* Convert a if return statement to a variable declaration and a if statement:
			*
			* if return users.find(x => x.name === "admin")
			*
			* will be converted to:
			*
			* const test = users.find(x => x.name === "admin")
			* if (test) return test
			*/

		if (
			tsx.isIfStatement(node) &&
			tsx.isIdentifier(node.expression) &&
			node.expression.text === "" &&
			tsx.isReturnStatement(node.thenStatement)
		) {
			const identifier = factory.getGeneratedNameForNode(node);
			const variableDeclaration = factory.createVariableDeclaration(
				identifier,
				undefined,
				undefined,
				node.thenStatement.expression
			);

			const variableStatement = factory.createVariableStatement(
				undefined,
				factory.createVariableDeclarationList([variableDeclaration], tsx.NodeFlags.Const)
			);
			const ifStatement = factory.createIfStatement(identifier, factory.createReturnStatement(identifier));

			return [variableStatement, ifStatement];
		}
		return tsx.visitEachChild(node, visit, ctx);
	}

	const newFile = tsx.visitNode(sourceFile, visit) as ts.SourceFile;

	return newFile;
}
