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
import { BaseLanguageServerContribution, IConnection, LanguageServerStartOptions } from "@theia/languages/lib/node";
import { XML_LANGUAGE_ID, XML_LANGUAGE_NAME } from '../common';
import { join, resolve } from 'path';
import * as path from 'path';
import { FileUri } from '@theia/core/lib/node';
import URI from '@theia/core/lib/common/uri';

const JAR_PATH = FileUri.fsPath(new URI(resolve(join(__dirname, '..', '..', 'lsp4xml', 'org.eclipse.lsp4xml-all.jar'))))

export interface StartOptions extends LanguageServerStartOptions {
    parameters?: string
}


@injectable()
export class XMLContribution extends BaseLanguageServerContribution {

    readonly id = XML_LANGUAGE_ID;
    readonly name = XML_LANGUAGE_NAME;

    start(clientConnection: IConnection, { parameters }: StartOptions): void {
        try {
            this.logInfo(parameters as string)
            const args: string[] = []
            if(typeof parameters === 'string') {
                parseVMargs(args, parameters);
            }
            args.push('-jar');
            args.push(path.resolve(__dirname, JAR_PATH));
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

export function parseVMargs(params: any[], vmargsLine: string) {
	if (!vmargsLine) {
		return;
	}
	let vmargs = vmargsLine.match(/(?:[^\s"]+|"[^"]*")+/g);
	if (vmargs === null) {
		return;
	}
	vmargs.forEach(arg => {
		//remove all standalone double quotes
		arg = arg.replace(/(\\)?"/g, function ($0, $1) { return ($1 ? $0 : ''); });
		//unescape all escaped double quotes
		arg = arg.replace(/(\\)"/g, '"');
		if (params.indexOf(arg) < 0) {
			params.push(arg);
		}
	});
}