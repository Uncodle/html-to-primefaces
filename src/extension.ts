'use strict'

import * as vscode from 'vscode'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {

    const editor = vscode.window.activeTextEditor

    const initFindAndReplace = ( elemName: string, elemRegex: RegExp, elemReplace: string ) => {
        vscode.workspace.findFiles( '**/*.asp')
        .then( ( files: Array<Object> ) => {
            files.forEach( (file, i) => {
                vscode.workspace.openTextDocument( file.path )
                    .then( ( currentFile: any ) => {
                        fs.readFile(currentFile.uri.fsPath, 'utf8', function (err, data) {
                            if (err) return console.log(err)

                            let result = data.replace( elemRegex, elemReplace )

                            if(elemName === 'Textarea' ){
                                result = data.replace( '</textarea>', '' )
                            }
                          
                            fs.writeFile(currentFile.uri.fsPath, result, 'utf8', function (err) {
                               if (err) return console.log(err)
                            });
                          });

                    })     
                    .then(undefined, err: Error => {
                        console.error('Error:', err)
                        return
                     })    
            })
        })
        .then( () => {
            vscode.window.showInformationMessage(`htmlToPrimefacesConverter: ${elemName} substítuidos!`);
        })
        .then( undefined, err => {
            console.error('Error:', err)
        })
    }

    const initElementSelector = () => {
        let elemRegex: RegExp
        let elemReplace: string
        let elementsList = ['Input','Textarea', 'Select (BETA)']

        vscode.window.showQuickPick( elementsList )
            .then( ( response: any ) => {

                if( response == elementsList[0] ){
                    elemRegex = /<input(.*?)type=\"text\"/g
                    elemReplace = '<p:inputText'
                }else if ( response == elementsList[1] ){
                    elemRegex = /<textarea/g
                    elemReplace =  '<p:inputTextArea'
                }else if ( response == elementsList[2] ){
                    vscode.window.showInformationMessage('Este comando está em beta.');
                    return
                }

                initFindAndReplace(response, elemRegex, elemReplace)
            })
    }

    const init = () => {
        initElementSelector()
    }

    let htmlToPrimefacesConverter = vscode.commands.registerCommand('extension.htmlToPrimefacesConverter', () => {        
        init();
    });

    context.subscriptions.push( htmlToPrimefacesConverter )
}

export function deactivate() {}