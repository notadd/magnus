import * as ast from "./ast";

export class ToString implements ast.Visitor {
    name: string = `ToString`;

    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: any): string {
        return `${node.type.visit(this, context)}!`
    }

    visitListTypeAst(node: ast.ListTypeAst, context: any): string {
        return `[${node.type.visit(this, context)}]`
    }

    visitNameAst(node: ast.NameAst, context: any): string {
        return node.value;
    }

    visitNamedTypeAst(node: ast.NamedTypeAst, context: any): string {
        return node.name.visit(this, context)
    }
}