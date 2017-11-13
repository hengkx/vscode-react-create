import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class AppModel {

    createFileOrFolder(taskType: 'file' | 'folder', relativePath?: string) {
        relativePath = relativePath || '/';
        const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        if (path.resolve(relativePath) === relativePath)
            relativePath = relativePath.substring(projectRoot.length).replace(/\\/g, "/");

        if (!relativePath.endsWith("/")) relativePath += '/';
        const basepath = projectRoot;
        vscode.window.showInputBox({
            value: '',
            prompt: `Create React New Component`,
            ignoreFocusOut: true,
            valueSelection: [-1, -1]
        }).then((name) => {
            if (!name) return;
            try {
                const targetpath = path.join(basepath, relativePath, name);

                this.createComponent(targetpath, name);

                setTimeout(() => { //tiny delay
                    vscode.workspace.openTextDocument(path.join(targetpath, `${name}.js`))
                        .then((editor) => {
                            if (!editor) return;
                            vscode.window.showTextDocument(editor);
                        });
                }, 50);
            } catch (error) {
                vscode.window.showErrorMessage("Somthing went wrong! Please report on GitHub");
            }

        });
    }


    createComponent(dir: string, name: string) {
        if (fs.existsSync(dir)) return;
        fs.mkdirSync(dir);

        fs.writeFileSync(path.join(dir, 'index.js'),
            `import ${name} from './${name}';\n\nexport default ${name};`);

        fs.writeFileSync(path.join(dir, `${name}.js`),
            `import React from 'react';\n\nclass ${name} extends React.Component {\n  render() {\n    return (\n      <div>\n        ${name}\n      </div>\n    );\n  }\n}\n\nexport default ${name};\n`);
    }

    findDir(filePath: string) {
        if (!filePath) return null;
        if (fs.statSync(filePath).isFile())
            return path.dirname(filePath);

        return filePath;
    }
}