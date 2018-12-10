'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    const editor = vscode.window.activeTextEditor;
    const initFindAndReplace = (elemName, elemRegex, elemReplace) => {
        vscode.workspace.findFiles('**/*.asp')
            .then((files) => {
            files.forEach((file, i) => {
                vscode.workspace.openTextDocument(file.path)
                    .then((currentFile) => {
                    fs.readFile(currentFile.uri.fsPath, 'utf8', function (err, data) {
                        if (err)
                            return console.log(err);
                        let result = data.replace(elemRegex, elemReplace);
                        if (elemName === 'Textarea') {
                            result = data.replace('</textarea>', '');
                        }
                        fs.writeFile(currentFile.uri.fsPath, result, 'utf8', function (err) {
                            if (err)
                                return console.log(err);
                        });
                    });
                })
                    .then(undefined, err => {
                    console.error('Erro:', err);
                    return;
                });
            });
        })
            .then(() => {
            vscode.window.showInformationMessage(`htmlToPrimefacesConverter: ${elemName} substítuidos!`);
        })
            .then(undefined, err => {
        });
    };
    const initElementSelector = () => {
        let elemRegex;
        let elemReplace;
        let elementsList = ['Input', 'Textarea', 'Select (BETA)'];
        vscode.window.showQuickPick(elementsList)
            .then((response) => {
            if (response == elementsList[0]) {
                elemRegex = /<input(.*?)type=\"text\"/g;
                elemReplace = '<p:inputText';
            }
            else if (response == elementsList[1]) {
                elemRegex = /<textarea/g;
                elemReplace = '<p:inputTextArea';
            }
            else if (response == elementsList[2]) {
                vscode.window.showInformationMessage('Este comando está em beta.');
                return;
            }
            initFindAndReplace(response, elemRegex, elemReplace);
        });
    };
    const init = () => {
        initElementSelector();
    };
    let htmlToPrimefacesConverter = vscode.commands.registerCommand('extension.htmlToPrimefacesConverter', () => {
        init();
    });
    context.subscriptions.push(htmlToPrimefacesConverter);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map