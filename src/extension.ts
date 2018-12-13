'use strict'

import * as vscode from 'vscode'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {

    const editor = vscode.window.activeTextEditor

    const initFindAndReplace = ( elemName: string, elemRegex: RegExp, elemReplace: string ) => {
        vscode.workspace.findFiles( './**/*.asp')
        .then( ( files: Array<Object> ) => {
            files.forEach( (file, i) => {
                vscode.workspace.openTextDocument( file.path )
                    .then( ( currentFile: any ) => {
                        fs.readFile(currentFile.uri.fsPath, 'utf8', function (err, data) {
                            if (err) return console.log(err)

                            let result;

                            if(elemName === 'Textarea' ){
                                result = data.replace( elemRegex, elemReplace )
                                             .replace(/<\/textarea>/g, '')
                            }else {
                                result = data.replace( elemRegex, elemReplace )
                            }
                          
                            fs.writeFile(currentFile.uri.fsPath, result, 'utf8', function (err) {
                               if (err) return console.log(err)
                            });
                          });

                    })     
                    .then(undefined, err => {
                        console.error('Error:', err)
                        return
                     })    
            })
        })
        .then( () => {
            vscode.window.showInformationMessage(`html2PrimefacesConverter: Elementos do tipo ${elemName} estão sendo substítuidos! Cheque seus arquivos.`);
        })
        .then( undefined, err => {
            console.error('Error:', err)
        })
    }

    const initElementSelector = () => {
        let elemRegex: RegExp
        let elemReplace: string
        let elementsList = ['Input','Textarea', 'Select (EM BREVE)']

        vscode.window.showQuickPick( elementsList )
            .then( ( response: any ) => {

                if( response == elementsList[0] ){
                    elemRegex = /<input(.*?)([^\n]*\n+)?([\t])?type=\"text\"/gmi
                    elemReplace = '<p:inputText'
                }else if ( response == elementsList[1] ){
                    elemRegex = /<textarea/g
                    elemReplace =  '<p:inputTextArea'
                }else if ( response == elementsList[2] ){
                    vscode.window.showInformationMessage('Este comando está em beta e será lançado em breve.');
                    return
                }

                initFindAndReplace(response, elemRegex, elemReplace)
            })
    }

    const init = () => {
        initElementSelector()
    }

    let html2PrimefacesConverter = vscode.commands.registerCommand('extension.html2PrimefacesConverter', () => {        
        init();
    });

    context.subscriptions.push( html2PrimefacesConverter )
}

export function deactivate() {}