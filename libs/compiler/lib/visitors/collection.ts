import * as ast from './visitor';
export class CollectionContext {
    imports: ast.ImportDeclaration[] = [];
    interfaces: ast.InterfaceDeclaration[] = [];
    classes: ast.ClassDeclaration[] = [];
    types: ast.TypeAliasDeclaration[] = [];
    enums: ast.EnumDeclaration[] = [];
    variables: ast.VariableStatement[] = [];
    isServer: boolean;
    addImportDeclaration(node: ast.ImportDeclaration) {
        this.imports.push(node);
    }
    addInterfaceDeclaration(node: ast.InterfaceDeclaration) {
        this.interfaces.push(node);
    }
    addClassDeclaration(node: ast.ClassDeclaration) {
        this.classes.push(node);
    }
    addTypeAliasDeclaration(node: ast.TypeAliasDeclaration) {
        this.types.push(node);
    }
    addEnumDeclaration(node: ast.EnumDeclaration) {
        this.enums.push(node);
    }
    addVariableStatement(node: ast.VariableStatement) {
        this.variables.push(node);
    }
    findByName(name: string) {
        const inter = this.findInterfaceByName(name);
        if (inter) return inter;
        const cls = this.findClassByName(name);
        if (cls) return cls;
        const _enum = this.findEnumByName(name);
        if (_enum) return _enum;
        const type = this.findTypeByName(name);
        if (type) return type;
    }
    findInterfaceByName(name: string) {
        return this.interfaces.find(int => int.name.text === name)
    }
    findTypeByName(name: string) {
        return this.types.find(int => int.name.text === name)
    }
    findClassByName(name: string) {
        return this.classes.find(int => int.name.text === name)
    }
    findEnumByName(name: string) {
        return this.enums.find(enu => enu.name.text === name)
    }
}
export class CollectionVisitor implements ast.Visitor {
    name: string = `CollectionVisitor`;
    visitSourceFile(node: ast.SourceFile, context: CollectionContext) {
        node.statements.map(statement => statement.visit(this, context))
    }
    visitImportDeclaration(node: ast.ImportDeclaration, context: CollectionContext) {
        // context.addImportDeclaration(node)
    }
    visitVariableStatement(node: ast.VariableStatement, context: CollectionContext) {
        context.addVariableStatement(node);
    }
    visitInterfaceDeclaration(node: ast.InterfaceDeclaration, context: CollectionContext) {
        context.addInterfaceDeclaration(node)
    }
    visitClassDeclaration(node: ast.ClassDeclaration, context: CollectionContext) {
        context.addClassDeclaration(node);
    }
    visitTypeAliasDeclaration(node: ast.TypeAliasDeclaration, context: CollectionContext) {
        context.addTypeAliasDeclaration(node);
    }
    visitEnumDeclaration(node: ast.EnumDeclaration, context: CollectionContext) {
        context.addEnumDeclaration(node);
    }
    visitImportEqualsDeclaration(node: ast.ImportEqualsDeclaration, context: CollectionContext) { }
    visitFunctionDeclaration(node: ast.FunctionDeclaration, context: CollectionContext) { }
    visitExpressionStatement(node: ast.ExpressionStatement, context: CollectionContext) { }
    visitEmptyStatement(node: ast.EmptyStatement, context: any) { }
    visitDebuggerStatement(node: ast.DebuggerStatement, context: any) { }
    visitExportDeclaration(node: ast.ExportDeclaration, context: any) { }
    visitExportAssignment(node: ast.ExportAssignment, context: any) { }
}
export const collectionVisitor = new CollectionVisitor();
export const collectionContext = new CollectionContext();
