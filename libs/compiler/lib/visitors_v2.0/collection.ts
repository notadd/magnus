import * as ast from './visitor';
import { CompilerOptions } from 'typescript';
import { MagnusConfig } from '@nger/magnus-core';
export class CollectionVisitor { }

export type Statement =
    CollectionClass |
    CollectionInterface |
    CollectionType |
    CollectionFunction;

export class CollectionClass {
    name: string;
}
export class CollectionInterface {
    name: string;
}
export class CollectionType {
    name: string;
}
export class CollectionFunction {
    name: string;
}
export const cache: Map<string, CollectionFile> = new Map();
/**
 * 这是一个文件
 */
export class CollectionFile {
    /**
     * 根目录
     */
    root: string;
    statements: Map<string, Statement> = new Map();
    /**
     * 导出的文件
     */
    exports: Map<string, Statement> = new Map();
    /**
     * 获取statement
     * @param key 
     */
    getStatement(key: string): Statement | undefined {
        return this.statements.get(key)
    }
    /**
     * 解析
     */
    resolve(file: string): string {
        return require.resolve(file)
    }
}
/**
 * 这是一个项目 多个文件
 */
export class CollectionProject {
    /**
    * 根目录
    */
    root: string;
    /**
     * 文件
     */
    files: Map<string, CollectionFile> = new Map();
    /**
     * 编译选项
     */
    compilerOptions: CompilerOptions;
    /**
     * magnus配置
     */
    config: MagnusConfig;
    /**
     * 获取文件
     */
    getFile(key: string): CollectionFile | undefined {
        return this.files.get(key)
    }
    /**
     * 添加文件
     * @param key 
     * @param file 
     */
    addFile(key: string, file: CollectionFile) {
        this.files.set(key, file)
    }

    /**
     * 解析
     */
    resolve(file: string): string {
        return require.resolve(file)
    }
}
/**
 * 多个项目
 */
export class Collection {
    projects: Map<string, CollectionProject> = new Map();
    /**
     * 根目录
     */
    root: string;
    /**
     * 编译选项
     */
    compilerOptions: CompilerOptions;

    /**
     * 解析
     */
    resolve(file: string): string {
        return require.resolve(file)
    }

    /**
     * 获取指定名称的项目
     */
    getProject(key: string): CollectionProject | undefined {
        return this.projects.get(key)
    }
    /**
     * 获取指定项目下某文件
     */
    getProjectFile(project: string, file: string) {
        const _project = this.getProject(project);
        if (_project) return _project.getFile(file)
    }
    /**
     * 添加项目
     */
    addProject(key: string, project: CollectionProject) {
        this.projects.set(key, project)
    }
}
