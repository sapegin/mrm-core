interface File {
	exists() : boolean;
	get(): string;
	getStyle(): EditorConfigStyle;
	getIndent(): string;
	save(content: string): this;
}

interface Ini {
	exists() : boolean;
	get(section?: string): any;
	set(section: string, value: any): this;
	unset(section: string): this;
	save(): this;
}

interface Json {
	exists() : boolean;
	get(address: string | string[], defaultValue?: any): any;
	set(address: string | string[], value: any): this;
	unset(address: string | string[]): this;
	merge(value: object): this;
	save(): this;
}

interface Lines {
	exists() : boolean;
	get(): string[];
	set(values: string[]): this;
	add(values: string | string[]): this;
	remove(values: string | string[]): this;
	save(): this;
}

interface Markdown {
	exists() : boolean;
	get(): string;
	addBadge(imageUrl: string, linkUrl: string, altText?: string) : this;
	save(): this;
}

interface Template {
	exists() : boolean;
	get(): string;
	apply(...args: object[]) : this;
	save(): this;
}

interface Yaml {
	exists() : boolean;
	get(address: string | string[], defaultValue?: any): any;
	set(address: string | string[], value: any): this;
	unset(address: string | string[]): this;
	merge(value: object): this;
	save(): this;
}


interface PackageJson extends Json {
	getScript(name: string) : string;
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
}

interface EditorConfigStyle {
	indent_style?: 'tab' | 'space' | 'unset';
	indent_size?: number | 'tab' | 'unset';
	insert_final_newline?: true | false | 'unset';
}

declare module 'mrm-core' {
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
	declare function install(deps: string | string[], options?: NpmOptions, exec?: Function) : void;
	declare function uninstall(deps: string | string[], options?: NpmOptions, exec?: Function) : void;

	// Formats
	declare function file(filename: string) : File;
	declare function ini(filename: string, comment?: string) : Ini;
	declare function json(filename: string, defaultValue?: object) : Json;
	declare function lines(filename: string, defaultValue?: string[]) : Lines;
	declare function markdown(filename: string) : Markdown;
	declare function template(filename: string, templateFile: string) : Template;
	declare function yaml(filename: string, defaultValue?: object) : Yaml;

	// Special files
	declare function packageJson(defaultValue?: object) : PackageJson;
}
