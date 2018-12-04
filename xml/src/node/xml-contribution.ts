
/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable } from "inversify";
import { BaseLanguageServerContribution, IConnection } from "@theia/languages/lib/node";
import { XML_LANGUAGE_ID, XML_LANGUAGE_NAME } from '../common';
import * as path from 'path';

@injectable()
export class XMLContribution extends BaseLanguageServerContribution {

    readonly id = XML_LANGUAGE_ID;
    readonly name = XML_LANGUAGE_NAME;

    start(clientConnection: IConnection): void {

        try {
            const pathToJar = '../../lsp4xml/org.eclipse.lsp4xml-all.jar'
            const args: string[] = [
                '-jar',
                path.resolve(__dirname, pathToJar)
            ]
            console.log(`Path to jar ${pathToJar}`)
            console.log(`Starting XML language server java ${args}`)
            const serverConnection = this.createProcessStreamConnection("java", args)
            this.forward(clientConnection, serverConnection)
        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    protected onDidFailSpawnProcess(error: Error): void {
        super.onDidFailSpawnProcess(error);
        console.error("Error starting xml language server.");
    }

}