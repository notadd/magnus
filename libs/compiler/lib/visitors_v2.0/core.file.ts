import { CoreVisitor } from './core';
import { SourceFile } from './visitor';
import * as ast from './visitor';
import * as ts from 'typescript';
import { CoreParse, CoreParseToString } from './core.parse';

export class CoreFile {
    fileAst: SourceFile;
    core: CoreVisitor = new CoreVisitor();
    private __toString: CoreParseToString = new CoreParseToString();
    constructor(public sourceFile: ts.SourceFile | undefined, public program: ts.Program) {
        if (this.sourceFile) {
            const parse = new CoreParse();
            const fileAst = this.core.visitSourceFile(new SourceFile(), this.sourceFile);
            this.fileAst = fileAst.visit(parse, this)
        }
    }
    private __getByNameFromStatements(name: string, statements: ast.Statement[]) {
        return statements.find(statement => {
            if (statement instanceof ast.ClassDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            }
            else if (statement instanceof ast.InterfaceDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            }
            else if (statement instanceof ast.VariableDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            }
            else if (statement instanceof ast.FunctionDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            }
            else if (statement instanceof ast.TypeAliasDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            }
            else if (statement instanceof ast.EnumDeclaration) {
                return name === statement.name.visit(this.__toString, ``)
            } else if (statement instanceof ast.ModuleDeclaration) {

            } else {
                return false;
            }
        })
    }
    private __getByNameFromModuleBlock(name: string, module: ast.ModuleBlock) {
        return this.__getByNameFromStatements(name, module.statements)
    }
    private __getByNameFromModule(name: string, module: ast.ModuleDeclaration) {
        if (module.body) {
            //  ModuleBlock | NamespaceDeclaration | JSDocNamespaceBody
            if (module.body instanceof ast.ModuleDeclaration) {

            }
        }
    }
    private __getByNameFromNamespaceBody(name: string, module: ast.NamespaceBody) {
        
    }
    getByName(name: string) {
        return this.__getByNameFromStatements(name, this.fileAst.statements)
    }
}
