import * as ast from './visitor';
import * as ts from 'typescript';
import { CoreFile } from './core.file'
export class CoreParse implements ast.Visitor {
    name: string = `CoreParse`;
    private __toString: CoreParseToString = new CoreParseToString();
    exports: any;
    visitSourceFile(node: ast.SourceFile, context: any) {
        node.statements.filter(it => !!it).map(statement => statement.visit(this, context));
        return node;
    }
    visitVariableStatement(node: ast.VariableStatement, context: CoreFile) {
        return node;
    }
    visitFunctionDeclaration(node: ast.FunctionDeclaration, context: CoreFile) {
        return node;
    }
    visitExportDeclaration(node: ast.ExportDeclaration, context: CoreFile) {
        if (node.moduleSpecifier) {
            // 从文件导出
            const from = node.moduleSpecifier.visit(this.__toString, context);
            const fromRes = context.core.resolvedModules.get(from);
            if (fromRes) {
                if (node.exportClause) {
                    const sourceFile = context.program.getSourceFile(fromRes.resolvedFileName);
                    const file = new CoreFile(sourceFile, context.program);
                    // export { a, b, c } from './1.ts';
                    node.exportClause.elements.map(ele => {
                        const name = ele.name.visit(this.__toString, context);
                        const res = file.getByName(name);
                        debugger;
                    })
                }
                else {
                    // export * from './1.ts';
                }
            }
        } else {
            if (node.exportClause) {
                // export {a,b,c}
                const exportClause = node.exportClause.visit(this.__toString, context);
            } else {
                throw new Error(`${this.name} visitExportDeclaration Error!`)
            }
        }
        return node;
    }
    visitNamedExports(node: ast.NamedExports, context: CoreFile) {
        return node;
    }
    visitExportAssignment(node: ast.ExportAssignment, context: CoreFile) {
        // export default a;
        return node;
    }
    visitImportDeclaration(node: ast.ImportDeclaration, context: CoreFile) {
        const from: string = node.moduleSpecifier.visit(this.__toString, context);
        const importClause = node.importClause.visit(this.__toString, context);
        const res = context.core.resolvedModules.get(from);
        if (res) {
            const sourceFile = context.program.getSourceFile(res.resolvedFileName);
            const file = new CoreFile(sourceFile, context.program);
            if (importClause.kind === 0) {
                console.log(importClause.elements)
            }
            else if (importClause.kind === 1) {
                console.log(importClause.type)
            }
            else {
                console.log(importClause.type)
            }
        }
        return node;
    }
    visitModuleDeclaration(node: ast.ModuleDeclaration, context: any) {
        return node;
    }
}

export class CoreParseToString implements ast.Visitor {
    name: string = `CoreParseToString`;
    visitStringLiteral(node: ast.StringLiteral, context: any) {
        return node.text;
    }
    visitImportClause(node: ast.ImportClause, context: any): any {
        if (node.namedBindings) {
            if (node.namedBindings instanceof ast.NamedImports) {
                return {
                    elements: node.namedBindings.elements.map(ele => ele.visit(this, context)),
                    type: 'import {} from',
                    kind: 0
                }
            } else {
                return {
                    name: node.namedBindings.name.visit(this, context),
                    type: 'import * as',
                    kind: 1
                }
            }
        } else {
            return {
                name: node.name.visit(this, context),
                type: 'import default',
                kind: 2
            }
        }
    }
    visitImportSpecifier(node: ast.ImportSpecifier, contedxt: any) {
        return {
            name: node.name.visit(this, context),
            propertyName: node.propertyName && node.propertyName.visit(this, context)
        }
    }
    visitIdentifier(node: ast.Identifier, context: any) {
        return node.text;
    }
    visitNamedExports(node: ast.NamedExports, context: any) {
        return {
            elements: node.elements.map(ele => ele.visit(this, context))
        }
    }
    visitExportSpecifier(node: ast.ExportSpecifier, context: any) {
        return {
            propertyName: node.propertyName && node.propertyName.visit(this, context),
            name: node.name.visit(this, context)
        }
    }
}