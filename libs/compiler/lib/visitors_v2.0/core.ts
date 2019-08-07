/**
 * import { core } from '';
 * import * as core from '';
 * import core from '';
 * import { core as ngCore } from '';
 */
import * as ast from './visitor';
import * as ts from 'typescript';
import * as util from './util';

export class CoreVisitor implements ast.Visitor {
    name: string = `CoreVisitor`;
    resolvedModules: Map<string, ts.ResolvedModuleFull> = new Map();
    visitSourceFile(node: ast.SourceFile, context: ts.SourceFile) {
        if ((context as any).resolvedModules) this.resolvedModules = (context as any).resolvedModules;
        node.statements = context.statements.map(statement => this.visitStatement(undefined, statement));
        return node;
    }
    visitStatement(node: any, context: ts.Statement) {
        if (ts.isImportDeclaration(context)) return this.visitImportDeclaration(new ast.ImportDeclaration(), context)
        else if (ts.isVariableStatement(context)) return this.visitVariableStatement(new ast.VariableStatement(), context)
        else if (ts.isExportDeclaration(context)) return this.visitExportDeclaration(new ast.ExportDeclaration(), context)
        else if (ts.isModuleDeclaration(context)) return this.visitModuleDeclaration(new ast.ModuleDeclaration(), context)
        else if (ts.isFunctionDeclaration(context)) return this.visitFunctionDeclaration(new ast.FunctionDeclaration(), context)
        else if (ts.isExportAssignment(context)) return this.visitExportAssignment(new ast.ExportAssignment(), context)
        else if (ts.isInterfaceDeclaration(context)) return this.visitInterfaceDeclaration(new ast.InterfaceDeclaration(), context)
        else if (ts.isTypeAliasDeclaration(context)) return this.visitTypeAliasDeclaration(new ast.TypeAliasDeclaration(), context)
        else if (ts.isEnumDeclaration(context)) return this.visitEnumDeclaration(new ast.EnumDeclaration(), context)
        else if (ts.isClassDeclaration(context)) return this.visitClassDeclaration(new ast.ClassDeclaration(), context)
        else console.log(context)
        return undefined as any;
    }
    visitClassDeclaration(node: ast.ClassDeclaration, context: ts.ClassDeclaration) {
        return node;
    }
    visitEnumDeclaration(node: ast.EnumDeclaration, context: ts.EnumDeclaration) {
        return node;
    }
    visitTypeAliasDeclaration(node: ast.TypeAliasDeclaration, context: ts.TypeAliasDeclaration) {
        return node;
    }
    visitInterfaceDeclaration(node: ast.InterfaceDeclaration, context: ts.InterfaceDeclaration) {
        node.kind = context.kind;
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        if (context.typeParameters) node.typeParameters = context.typeParameters.map(type => this.visitTypeParameterDeclaration(new ast.TypeParameterDeclaration(), type))
        if (context.heritageClauses) node.heritageClauses = context.heritageClauses.map(heritage => this.visitHeritageClause(new ast.HeritageClause(), heritage));
        node.members = context.members.map(member => this.visitTypeElement(undefined, member))
        return node;
    }
    visitTypeParameterDeclaration(node: ast.TypeParameterDeclaration, context: ts.TypeParameterDeclaration) {
        node.kind = context.kind;
        if (context.constraint) node.constraint = this.visitTypeNode(undefined, context.constraint);
        if (context.default) node.default = this.visitTypeNode(undefined, context.default);
        if (context.expression) node.expression = this.visitExpression(undefined, context.expression);
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        return node;
    }
    visitPropertySignature(node: ast.PropertySignature, context: ts.PropertySignature) {
        node.name = this.visitPropertyName(undefined, context.name);
        if (context.questionToken) node.questionToken = context.questionToken;;
        if (context.type) node.type = this.visitTypeNode(undefined, context.type);
        if (context.initializer) node.initializer = this.visitExpression(undefined, context.initializer);
        return node;
    }
    visitMethodSignature(node: ast.MethodSignature, context: ts.MethodSignature) {
        node.name = this.visitPropertyName(undefined, context.name);
        if (context.type) node.type = this.visitTypeNode(undefined, context.type);
        if (context.typeParameters) node.typeParameters = context.typeParameters.map(par => this.visitTypeParameterDeclaration(new ast.TypeParameterDeclaration(), par))
        node.parameters = context.parameters.map(par => this.visitParameterDeclaration(new ast.ParameterDeclaration(), par))
        if (context.questionToken) node.questionToken = context.questionToken;
        return node;
    }
    visitParameterDeclaration(node: ast.ParameterDeclaration, context: ts.ParameterDeclaration) {
        return node;
    }
    visitIndexSignatureDeclaration(node: ast.IndexSignatureDeclaration, context: ts.IndexSignatureDeclaration) {
        return node;
    }
    visitConstructSignatureDeclaration(node: ast.ConstructSignatureDeclaration, context: ts.ConstructSignatureDeclaration) {
        return node;
    }
    visitCallSignatureDeclaration(node: ast.CallSignatureDeclaration, context: ts.CallSignatureDeclaration) {
        return node;
    }
    visitTypeElement(node: any, context: ts.TypeElement) {
        // PropertySignature | MethodSignature | IndexSignatureDeclaration | ConstructSignatureDeclaration | CallSignatureDeclaration
        if (ts.isPropertySignature(context)) {
            return this.visitPropertySignature(new ast.PropertySignature(), context)
        }
        else if (ts.isMethodSignature(context)) {
            return this.visitMethodSignature(new ast.MethodSignature(), context)
        }
        else if (ts.isIndexSignatureDeclaration(context)) {
            return this.visitIndexSignatureDeclaration(new ast.IndexSignatureDeclaration(), context)
        }
        else if (ts.isConstructSignatureDeclaration(context)) {
            return this.visitConstructSignatureDeclaration(new ast.ConstructSignatureDeclaration(), context)
        }
        else if (ts.isCallSignatureDeclaration(context)) {
            return this.visitCallSignatureDeclaration(new ast.CallSignatureDeclaration(), context)
        }
        else {
            console.log(context)
        }
        return node;
    }
    visitHeritageClause(node: ast.HeritageClause, context: ts.HeritageClause) {
        return node;
    }

    visitExportAssignment(node: ast.ExportAssignment, context: ts.ExportAssignment) {
        node.kind = context.kind;
        if (context.name) {
            // Identifier | StringLiteral | NumericLiteral
            if (ts.isIdentifier(context.name)) {
                node.name = this.visitIdentifier(new ast.Identifier(), context.name)
            }
            else if (ts.isStringLiteral(context.name)) {
                node.name = this.visitStringLiteral(new ast.StringLiteral(), context.name)
            } else {
                node.name = this.visitNumericLiteral(new ast.NumericLiteral(), context.name)
            }
        }
        node.expression = this.visitExpression(undefined, context.expression);
        node.isExportEquals = !!context.isExportEquals;
        return node;
    }
    visitModuleDeclaration(node: ast.ModuleDeclaration, context: ts.ModuleDeclaration) {
        node.kind = context.kind;
        node.name = this.visitModuleName(undefined, context.name);
        if (ts.isModuleBlock(context)) {
            node.body = this.visitModuleBlock(new ast.ModuleBlock(), context)
        }
        else if (ts.isIdentifier(context)) {
            node.body = this.visitIdentifier(new ast.Identifier(), context)
        }
        else if (ts.isModuleDeclaration(context)) {
            node.body = this.visitNamespaceDeclaration(new ast.NamespaceDeclaration(), context as ts.NamespaceDeclaration)
        }
        else {
            node.body = this.visitJSDocNamespaceDeclaration(new ast.JSDocNamespaceDeclaration(), context)
        }
        return node;
    }
    visitJSDocNamespaceDeclaration(node: ast.JSDocNamespaceDeclaration, context: ts.JSDocNamespaceDeclaration) {
        return node;
    }
    visitNamespaceDeclaration(node: ast.NamespaceDeclaration, context: ts.NamespaceDeclaration) {
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        // ModuleBlock | NamespaceDeclaration
        if (ts.isModuleBlock(context.body)) {
            node.body = this.visitModuleBlock(new ast.ModuleBlock(), context.body)
        } else {
            node.body = this.visitNamespaceDeclaration(new ast.NamespaceDeclaration(), context.body)
        }
        return node;
    }
    visitModuleBlock(node: ast.ModuleBlock, context: ts.ModuleBlock) {
        node.kind = context.kind;
        node.statements = context.statements.map(statement => this.visitStatement(undefined, statement))
        return node;
    }
    visitModuleName(node: any, context: ts.ModuleName) {
        // Identifier | StringLiteral
        if (ts.isIdentifier(context)) {
            return this.visitIdentifier(new ast.Identifier(), context);
        } else {
            return this.visitStringLiteral(new ast.StringLiteral(), context)
        }
    }
    visitFunctionDeclaration(node: ast.FunctionDeclaration, context: ts.FunctionDeclaration) {
        if (context.body) node.body = this.visitFunctionBody(new ast.FunctionBody(), context.body);
        if (context.name) node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        node.parameters = context.parameters.map(par => this.visitParameterDeclaration(new ast.ParameterDeclaration(), par))
        if (context.typeParameters) node.typeParameters = context.typeParameters.map(type => this.visitTypeParameterDeclaration(new ast.TypeParameterDeclaration(), type))
        if (context.type) node.type = this.visitTypeNode(undefined, context.type);
        return node;
    }
    visitFunctionBody(node: ast.FunctionBody, context: ts.FunctionBody) {
        node.kind = context.kind;
        node.statements = context.statements.map(statement => this.visitStatement(undefined, statement))
        return node;
    }
    visitImportDeclaration(node: ast.ImportDeclaration, context: ts.ImportDeclaration) {
        node.kind = context.kind;
        node.moduleSpecifier = this.visitExpression(undefined, context.moduleSpecifier);
        if (context.importClause) node.importClause = this.visitImportClause(new ast.ImportClause(), context.importClause);
        return node;
    }
    visitImportClause(node: ast.ImportClause, context: ts.ImportClause) {
        node.kind = context.kind;
        if (context.name) node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        if (context.namedBindings) node.namedBindings = this.visitNamedImportBindings(undefined, context.namedBindings);
        return node;
    }
    visitNamedImportBindings(node: any, context: ts.NamedImportBindings) {
        if (ts.isNamespaceImport(context)) {
            return this.visitNamespaceImport(new ast.NamespaceImport(), context)
        } else {
            return this.visitNamedImports(new ast.NamedImports(), context)
        }
    }
    /**
     * import * as ts from 'typescript';
     */
    visitNamespaceImport(node: ast.NamespaceImport, context: ts.NamespaceImport) {
        node.__name = `NamespaceImport`;
        node.kind = context.kind;
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        return node;
    }
    /**
     * import { ScriptKind } from 'typescript';
     * import { ScriptKind as Kind } from 'typescript';
     */
    visitNamedImports(node: ast.NamedImports, context: ts.NamedImports) {
        node.__name = `NamedImports`;
        node.kind = context.kind;
        node.elements = context.elements.map(ele => this.visitImportSpecifier(new ast.ImportSpecifier(), ele))
        return node;
    }
    /**
     * import typescript from 'typescript';
     */
    visitImportSpecifier(node: ast.ImportSpecifier, context: ts.ImportSpecifier) {
        node.__name = `ImportSpecifier`;
        node.kind = context.kind;
        if (context.propertyName) node.propertyName = this.visitIdentifier(new ast.Identifier(), context.propertyName);
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        return node;
    }
    /**
     * finish identifier
     */
    visitIdentifier(node: ast.Identifier, context: ts.Identifier) {
        node.kind = context.kind;
        node.text = context.text;
        node.escapedText = context.escapedText;
        node.isInJSDocNamespace = !!context.isInJSDocNamespace;
        node.originalKeywordKind = context.originalKeywordKind;
        return node;
    }
    /**
     * todo
     */
    visitExpression(node: any, context: ts.Expression) {
        if (ts.isStringLiteral(context)) {
            return this.visitStringLiteral(new ast.StringLiteral(), context)
        } else if (ts.isNumericLiteral(context)) {
            return this.visitNumericLiteral(new ast.NumericLiteral(), context)
        } else if (ts.isIdentifier(context)) {
            return this.visitIdentifier(new ast.Identifier(), context)
        } else {
            console.log(context)
        }
        return node;
    }
    visitVariableStatement(node: ast.VariableStatement, context: ts.VariableStatement) {
        node.kind = context.kind;
        node.declarationList = this.visitVariableDeclarationList(new ast.VariableDeclarationList(), context.declarationList)
        return node;
    }
    visitVariableDeclarationList(node: ast.VariableDeclarationList, context: ts.VariableDeclarationList) {
        node.kind = context.kind;
        node.declarations = context.declarations.map(dec => this.visitVariableDeclaration(new ast.VariableDeclaration(), dec));
        return node;
    }
    visitVariableDeclaration(node: ast.VariableDeclaration, context: ts.VariableDeclaration) {
        node.kind = context.kind;
        node.name = this.visitBindingName(undefined, context.name);
        if (context.exclamationToken) node.exclamationToken = context.exclamationToken;
        if (context.type) node.type = this.visitTypeNode(undefined, context.type);
        if (context.initializer) node.initializer = this.visitExpression(undefined, context.initializer);
        return node;
    }
    visitBindingName(node: any, context: ts.BindingName) {
        if (ts.isIdentifier(context)) {
            return this.visitIdentifier(new ast.Identifier(), context)
        } else if (ts.isObjectBindingPattern(context)) {
            return this.visitObjectBindingPattern(new ast.ObjectBindingPattern(), context)
        } else if (ts.isArrayBindingPattern(context)) {
            return this.visitArrayBindingPattern(new ast.ArrayBindingPattern(), context)
        }
        return node;
    }
    visitObjectBindingPattern(node: ast.ObjectBindingPattern, context: ts.ObjectBindingPattern) {
        node.kind = context.kind;
        node.elements = context.elements.map(ele => this.visitBindingElement(new ast.BindingElement(), ele))
        return node;
    }
    visitBindingElement(node: ast.BindingElement, context: ts.BindingElement) {
        node.kind = context.kind;
        if (context.propertyName) node.propertyName = this.visitPropertyName(undefined, context.propertyName)
        node.dotDotDotToken = context.dotDotDotToken;
        node.name = this.visitBindingName(undefined, context.name);
        if (context.initializer) node.initializer = this.visitExpression(undefined, context.initializer)
        return node;
    }
    visitPropertyName(node: any, context: ts.PropertyName) {
        if (ts.isIdentifier(context)) {
            return this.visitIdentifier(new ast.Identifier(), context)
        }
        else if (ts.isStringLiteral(context)) {
            return this.visitStringLiteral(new ast.StringLiteral(), context)
        }
        else if (ts.isNumericLiteral(context)) {
            return this.visitNumericLiteral(new ast.NumericLiteral(), context)
        }
        else if (ts.isComputedPropertyName(context)) {
            return this.visitComputedPropertyName(new ast.ComputedPropertyName(), context)
        }
        return node;
    }
    visitNumericLiteral(node: ast.NumericLiteral, context: ts.NumericLiteral) {
        node.kind = context.kind;
        node.text = context.text;
        node.isUnterminated = !!context.isUnterminated;
        node.hasExtendedUnicodeEscape = !!context.hasExtendedUnicodeEscape;
        return node;
    }
    visitComputedPropertyName(node: ast.ComputedPropertyName, context: ts.ComputedPropertyName) {
        node.kind = context.kind;
        node.expression = this.visitExpression(undefined, context.expression)
        return node;
    }
    visitArrayBindingPattern(node: ast.ArrayBindingPattern, context: ts.ArrayBindingPattern) {
        node.kind = context.kind;
        node.elements = context.elements.map(ele => this.visitArrayBindingElement(undefined, ele))
        return node;
    }
    visitArrayBindingElement(node: any, context: ts.ArrayBindingElement) {
        if (ts.isBindingElement(context)) {
            return this.visitBindingElement(new ast.BindingElement(), context)
        } else {
            return this.visitOmittedExpression(new ast.OmittedExpression(), context)
        }
    }
    visitOmittedExpression(node: ast.OmittedExpression, context: ts.OmittedExpression) {
        node.kind = context.kind;
        return node;
    }
    visitTypeNode(node: any, context: ts.TypeNode) {
        if (ts.isArrayTypeNode(context)) {
            return this.visitArrayTypeNode(new ast.ArrayTypeNode(), context)
        }
        else if (ts.isTypeReferenceNode(context)) {
            return this.visitTypeReferenceNode(new ast.TypeReferenceNode(), context)
        }
        else if (ts.isExpressionWithTypeArguments(context)) {
            return this.visitExpressionWithTypeArguments(new ast.ExpressionWithTypeArguments(), context)
        }
        else if (ts.isUnionTypeNode(context)) {
            return this.visitUnionTypeNode(new ast.UnionTypeNode(), context)
        }
        else if (ts.isUnionTypeNode(context)) {
            return this.visitUnionTypeNode(new ast.UnionTypeNode(), context)
        }
        else if (ts.isTupleTypeNode(context)) {
            return this.visitTupleTypeNode(new ast.TupleTypeNode(), context)
        }
        else if (ts.isFunctionTypeNode(context)) {
            return this.visitFunctionTypeNode(new ast.FunctionTypeNode(), context)
        }
        else if (util.isKeywordTypeNode(context)) {
            return this.visitKeywordTypeNode(new ast.KeywordTypeNode(), context)
        }
        else if (ts.isTypePredicateNode(context)) {
            return this.visitTypePredicateNode(new ast.TypePredicateNode(), context)
        }
        else if (ts.isThisTypeNode(context)) {
            return this.visitThisTypeNode(new ast.ThisTypeNode(), context)
        }
        else if (ts.isIndexedAccessTypeNode(context)) {
            return this.visitIndexedAccessTypeNode(new ast.IndexedAccessTypeNode(), context)
        }
        else if (ts.isLiteralTypeNode(context)) {
            return this.visitLiteralTypeNode(new ast.LiteralTypeNode(), context)
        }
        else if (ts.isIntersectionTypeNode(context)) {
            return this.visitIntersectionTypeNode(new ast.IntersectionTypeNode(), context)
        }
        else if (ts.isTypeLiteralNode(context)) {
            return this.visitTypeLiteralNode(new ast.TypeLiteralNode(), context)
        }
        else if (ts.isTypeQueryNode(context)) {
            return this.visitTypeQueryNode(new ast.TypeQueryNode(), context)
        }
        else if (ts.isParenthesizedTypeNode(context)) {
            return this.visitParenthesizedTypeNode(new ast.ParenthesizedTypeNode(), context)
        }
        else {
            console.log(context)
        }
        return node;
    }
    visitParenthesizedTypeNode(node: ast.ParenthesizedTypeNode, context: ts.ParenthesizedTypeNode) {
        node.type = this.visitTypeNode(undefined, context.type)
        return node;
    }
    visitTypeQueryNode(node: ast.TypeQueryNode, context: ts.TypeQueryNode) {
        node.exprName = this.visitEntityName(undefined, context.exprName)
        return node;
    }
    visitTypeLiteralNode(node: ast.TypeLiteralNode, context: ts.TypeLiteralNode) {
        node.members = context.members.map(member => this.visitTypeElement(undefined, member))
        return node;
    }
    visitIntersectionTypeNode(node: ast.IntersectionTypeNode, context: ts.IntersectionTypeNode) {
        return node;
    }
    visitLiteralTypeNode(node: ast.LiteralTypeNode, context: ts.LiteralTypeNode) {
        return node;
    }
    visitIndexedAccessTypeNode(node: ast.IndexedAccessTypeNode, context: ts.IndexedAccessTypeNode) {
        return node;
    }
    visitThisTypeNode(node: ast.ThisTypeNode, context: ts.ThisTypeNode) {
        return node;
    }
    visitTypePredicateNode(node: ast.TypePredicateNode, context: ts.TypePredicateNode) {
        return node;
    }
    visitKeywordTypeNode(node: ast.KeywordTypeNode, context: ts.KeywordTypeNode) {
        return node;
    }
    visitFunctionTypeNode(node: ast.FunctionTypeNode, context: ts.FunctionTypeNode) {
        return node;
    }
    visitTupleTypeNode(node: ast.TupleTypeNode, context: ts.TupleTypeNode) {
        return node;
    }
    visitUnionTypeNode(node: ast.UnionTypeNode, context: ts.UnionTypeNode) {
        return node;
    }
    visitExpressionWithTypeArguments(node: ast.ExpressionWithTypeArguments, context: ts.ExpressionWithTypeArguments) {
        return node;
    }
    visitTypeReferenceNode(node: ast.TypeReferenceNode, context: ts.TypeReferenceNode) {
        if (context.typeArguments) node.typeArguments = context.typeArguments.map(type => this.visitTypeNode(undefined, type))
        node.typeName = this.visitEntityName(undefined, context.typeName);
        return node;
    }
    visitEntityName(node: any, context: ts.EntityName) {
        if (ts.isIdentifier(context)) {
            return this.visitIdentifier(new ast.Identifier(), context)
        } else {
            return this.visitQualifiedName(new ast.QualifiedName(), context)
        }
    }
    visitQualifiedName(node: ast.QualifiedName, context: ts.QualifiedName) {
        node.kind = context.kind;
        node.left = this.visitEntityName(undefined, context.left)
        node.right = this.visitIdentifier(new ast.Identifier(), context.right)
        return node;
    }
    visitArrayTypeNode(node: ast.ArrayTypeNode, context: ts.ArrayTypeNode) {
        node.elementType = this.visitTypeNode(undefined, context.elementType)
        return node;
    }
    visitStringLiteral(node: ast.StringLiteral, context: ts.StringLiteral) {
        node.text = context.text;
        node.isUnterminated = !!context.isUnterminated;;
        node.hasExtendedUnicodeEscape = !!context.hasExtendedUnicodeEscape;;
        node.kind = context.kind;
        return node;
    }
    /**
     * export { a, b }
     */
    visitExportDeclaration(node: ast.ExportDeclaration, context: ts.ExportDeclaration) {
        node.kind = context.kind;
        if (context.exportClause) node.exportClause = this.visitNamedExports(new ast.NamedExports(), context.exportClause)
        if (context.moduleSpecifier) node.moduleSpecifier = this.visitExpression(undefined, context.moduleSpecifier);
        return node;
    }
    /**
     * export { ScriptKind } from 'typescript';
     */
    visitNamedExports(node: ast.NamedExports, context: ts.NamedExports) {
        node.kind = context.kind;
        node.elements = context.elements.map(ele => this.visitExportSpecifier(new ast.ExportSpecifier(), ele));
        return node;
    }
    /**
     * elements
     */
    visitExportSpecifier(node: ast.ExportSpecifier, context: ts.ExportSpecifier) {
        node.kind = context.kind
        if (context.propertyName) node.propertyName = this.visitPropertyName(undefined, context.propertyName)
        node.name = this.visitIdentifier(new ast.Identifier(), context.name);
        return node;
    }
}

export class CoreExport extends CoreVisitor {
    name: string = `CoreExport`;
}
