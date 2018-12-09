'use strict'

import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {

    const editor = vscode.window.activeTextEditor
    
    let findOccurences: any = () => {

        let elementTypes: Array<string> = ['input', 'select', 'textarea']
        
        let activeDocumentUri = editor.document.uri;
        let activePath = vscode.workspace.getWorkspaceFolder( activeDocumentUri )

        // let commands = vscode.commands.getCommands(false)
        //     .then( ( commands: Array<String> ) => {
        //         console.log(commands);
        //         commands.filter( ( command ) => {
        //             console.log( command.search )
        //         })    
        //     })

        vscode.workspace.findFiles( '**/*.asp')
            .then( ( files: Array<Object> ) => {

                let regExpression = new RegExp('(<input)','g')
                let currentText:string = '<input'
                let newText:string = '<p: input' 
                let match: any = undefined

                files.forEach( (file, i) => {
                    vscode.workspace.openTextDocument( file.path )
                        .then( ( currentFile: any ) => {
                            
                            let currentText: string = currentFile.getText()
                            let wEdit = new vscode.WorkspaceEdit()

                            wEdit.get( currentFile )
                            vscode.workspace.applyEdit(wEdit)
                        
                            console.log('-------')


                        })     
                        .then(undefined, err => {
                            console.error('Erro:', err)
                            return
                         })    
                })
            })

        vscode.window.showInformationMessage('findOccurences has initialized!')
    }

    let htmlToPrimefacesConverter = vscode.commands.registerCommand('extension.htmlToPrimefacesConverter', () => {        
        
        vscode.window.showInformationMessage('Hello World!')

        findOccurences();
    });

    context.subscriptions.push( htmlToPrimefacesConverter )
}

export function deactivate() {}