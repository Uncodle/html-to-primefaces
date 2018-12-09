'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    const editor = vscode.window.activeTextEditor;
    let findOccurences = () => {
        let elementTypes = ['input', 'select', 'textarea'];
        let activeDocumentUri = editor.document.uri;
        let activePath = vscode.workspace.getWorkspaceFolder(activeDocumentUri);
        // let commands = vscode.commands.getCommands(false)
        //     .then( ( commands: Array<String> ) => {
        //         console.log(commands);
        //         commands.filter( ( command ) => {
        //             console.log( command.search )
        //         })    
        //     })
        vscode.workspace.findFiles('**/*.asp')
            .then((files) => {
            let regExpression = new RegExp('(<input)', 'g');
            let currentText = '<input';
            let newText = '<p: input';
            let match = undefined;
            files.forEach((file, i) => {
                vscode.workspace.openTextDocument(file.path)
                    .then((currentFile) => {
                    let currentText = currentFile.getText();
                    let wEdit = new vscode.WorkspaceEdit();
                    wEdit.get(currentFile);
                    vscode.workspace.applyEdit(wEdit);
                    console.log('-------');
                })
                    .then(undefined, err => {
                    console.error('Erro:', err);
                    return;
                });
            });
        });
        vscode.window.showInformationMessage('findOccurences has initialized!');
    };
    let htmlToPrimefacesConverter = vscode.commands.registerCommand('extension.htmlToPrimefacesConverter', () => {
        vscode.window.showInformationMessage('Hello World!');
        findOccurences();
    });
    context.subscriptions.push(htmlToPrimefacesConverter);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map