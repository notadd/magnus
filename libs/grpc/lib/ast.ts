export abstract class Ast {
    abstract visit(visitor: Visitor, context: any): any;
}
type Child = Service | Message | Enum | OneOf;
export class Root extends Ast {
    packages: Package[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitRoot(this, context)
    }
}
export class Package extends Ast {
    name: string;
    syntax: string;
    children: Child[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitPackage(this, context)
    }

    hasChild(name: string) {
        return !!this.children.find(child => child.name === name);
    }
}
export class Identifier extends Ast {
    name: string;
    visit(visitor: Visitor, context: any) {
        return visitor.visitIdentifier(this, context)
    }
}
// enum
export class Enum extends Ast {
    name: string;
    items: EnumItem[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitEnum(this, context)
    }
}
// enum item
export class EnumItem extends Ast {
    name: string;
    value: any;
    visit(visitor: Visitor, context: any) {
        return visitor.visitEnumItem(this, context)
    }
}
// service
export class Service extends Ast {
    name: string;
    methods: Method[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitService(this, context)
    }
}
// method
export class Method extends Ast {
    name: string = ``;
    decorator: string[] = [];
    parameter: string = ``;
    type: string = ``;
    visit(visitor: Visitor, context: any) {
        return visitor.visitMethod(this, context)
    }
}
// message
export class Message extends Ast {
    name: string;
    fields: Field[] = [];
    children: Child[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitMessage(this, context)
    }
}
// field
export class Field extends Ast {
    type: string;
    name: string;
    index: number;
    decorator: string[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitField(this, context)
    }
}
export class OneOf extends Ast {
    name: string;
    items: Field[] = [];
    visit(visitor: Visitor, context: any) {
        return visitor.visitOneOf(this, context)
    }
}
export interface Visitor {
    visitIdentifier(node: Identifier, context: any): any;
    visitPackage(node: Package, context: any): any;
    visitRoot(node: Root, context: any): any;
    visitEnum(node: Enum, context: any): any;
    visitEnumItem(node: EnumItem, context: any): any;
    visitService(node: Service, context: any): any;
    visitMethod(node: Method, context: any): any;
    visitMessage(node: Message, context: any): any;
    visitField(node: Field, context: any): any;
    visitOneOf(node: OneOf, context: any): any;
}
export class ParseVisitor implements Visitor {
    visitIdentifier(node: Identifier, context: any): string {
        return node.name;
    }
    visitPackage(node: Package, context: any): string {
        return `package ${node.name};\nsyntax = "${node.syntax}";\n${node.children.map(pack => pack.visit(this, context)).join(`\n`)}`
    }
    visitRoot(node: Root, context: any): string {
        return `${node.packages.map(pack => pack.visit(this, context)).join(`\n`)}`
    }
    visitEnum(node: Enum, context: any): string {
        return `enum ${node.name}{\n\t${node.items.map(item => item.visit(this, context)).join(`\n`)}}`
    }
    visitEnumItem(node: EnumItem, context: any) {
        return `${node.name} = ${node.value}`;
    }
    visitService(node: Service, context: any): string {
        return `service ${node.name} {\n${node.methods.map(method => method.visit(this, context)).join(``)}}`
    }
    visitMethod(node: Method, context: any): string {
        return `\t${this.createDecorator(node.decorator)}${node.name}(${node.parameter}) returns(${node.type}) {}\n`
    }
    visitMessage(node: Message, context: any): string {
        return `message ${node.name}{\n${node.fields.map(field => field.visit(this, context)).join(``)}${node.children.map(child => child.visit(this, context)).join(`\n`)}}`;
    }
    visitField(node: Field, context: any): string {
        return `\t${this.createDecorator(node.decorator)}${node.type} ${node.name} = ${node.index};\n`
    }
    visitOneOf(node: OneOf, context: any): string {
        return `oneof ${node.name} {\n\t${node.items.map(item => item.visit(this, context)).join(`\n`)}}`
    }
    createDecorator(args: string[]) {
        if (args.length > 0) {
            return args.join(' ') + ` `
        }
        return ``
    }
}