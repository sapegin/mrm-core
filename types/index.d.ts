interface File {
	exists() : boolean;
	get(): string;
	getStyle(): EditorConfigStyle;
	getIndent(): string;
	save(content: string): this;
	delete(): void;
}

interface Ini {
	exists() : boolean;
	get(): any;
	get(section?: string): any;
	set(section: string, value: any): this;
	unset(section: string): this;
	save(): this;
	delete(): void;
}

interface Json {
	exists() : boolean;
	get(): any
	get(address: string | string[], defaultValue?: any): any;
	set(address: string | string[], value: any): this;
	unset(address: string | string[]): this;
	merge(value: object): this;
	save(): this;
	delete(): void;
}

interface Lines {
	exists() : boolean;
	get(): string[];
	set(values: string[]): this;
	add(values: string | string[]): this;
	remove(values: string | string[]): this;
	save(): this;
	delete(): void;
}

interface Markdown {
	exists() : boolean;
	get(): string;
	addBadge(imageUrl: string, linkUrl: string, altText?: string) : this;
	save(): this;
	delete(): void;
}

interface Template {
	exists() : boolean;
	get(): string;
	apply(...args: object[]) : this;
	save(): this;
	delete(): void;
}

interface Yaml {
	exists() : boolean;
	get(): any;
	get(address: string | string[], defaultValue?: any): any;
	set(address: string | string[], value: any): this;
	unset(address: string | string[]): this;
	merge(value: object): this;
	save(): this;
	delete(): void;
}


interface PackageJson extends Json {
	getScript(name: string, subcommand?: string) : string;
	setScript(name: string, command: string) : this;
	appendScript(name: string, command: string): this;
	prependScript(name: string, command: string): this;
	removeScript(name: RegExp | string, match?: RegExp | string): this;
}

interface CopyFilesOptions {
	overwrite?: boolean;
}

interface NpmOptions {
	dev?: boolean;
	yarn?: boolean;
	versions?: Dependencies;
}

interface EditorConfigStyle {
	indent_style?: 'tab' | 'space' | 'unset';
	indent_size?: number | 'tab' | 'unset';
	insert_final_newline?: true | false | 'unset';
}

interface Dependencies {
	[string]: string;
}

declare module 'mrm-core' {
	import * as child_process from 'child_process';

	declare class MrmError extends Error {
		constructor(message: string, extra?: any) : void;
	}

	// File system
	declare function readFile(filename: string) : string;
	declare function updateFile(filename: string, content: string, exists: boolean) : void;
	declare function copyFiles(sourceDir: string, files: string | string[], options?: CopyFilesOptions) : void;
	declare function deleteFiles(files: string | string[]) : void;
	declare function makeDirs(dirs: string | string[]) : void;

	// npm
	type SpawnSyncReturn = ReturnType<typeof child_process.spawnSync>;
	declare function install(deps: string | string[] | Dependencies, options?: NpmOptions) : SpawnSyncReturn | void;
	declare function install<E extends Function>(deps: string | string[] | Dependencies, options?: NpmOptions, exec?: E) : ReturnType<E> | void;
	declare function uninstall(deps: string | string[], options?: NpmOptions) : SpawnSyncReturn | void;
	declare function uninstall<E extends Function>(deps: string | string[], options?: NpmOptions, exec?: E) : ReturnType<E> | void;

	// EditorConfig
	declare function inferStyle(source: string) : EditorConfigStyle;
	declare function getStyleForFile(filepath: string) : EditorConfigStyle;
	declare function getIndent(style: EditorConfigStyle) : string;
	declare function format(source: string, style: EditorConfigStyle) : string;

	// Misc utils
	declare function getExtsFromCommand(command: string, arg?: string) : string[] | undefined;

	// Formats
	declare function file(filename: string) : File;
	declare function ini(filename: string, comment?: string) : Ini;
	declare function json(filename: string, defaultValue?: object) : Json;
	declare function lines(filename: string, defaultValue?: string[]) : Lines;
	declare function markdown(filename: string) : Markdown;
	declare function template(filename: string, templateFile: string) : Template;
	declare function yaml(filename: string, defaultValue?: object) : Yaml;

	// Special files
	declare function packageJson(defaultValue?: object, filename?: string) : PackageJson;
}
