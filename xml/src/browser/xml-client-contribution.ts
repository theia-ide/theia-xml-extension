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

import { injectable, inject } from "inversify";
import { BaseLanguageClientContribution, Workspace, Languages, LanguageClientFactory, ILanguageClient, DidChangeConfigurationNotification } from '@theia/languages/lib/browser';
import { XML_LANGUAGE_ID, XML_LANGUAGE_NAME } from '../common';
import { ResourceProvider } from "@theia/core";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class XMLClientContribution extends BaseLanguageClientContribution {

    readonly id = XML_LANGUAGE_ID;
    readonly name = XML_LANGUAGE_NAME;

    get configurationSection() {
        return ['xml'];
    }

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(ResourceProvider) protected readonly resourceProvider: ResourceProvider,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory) protected readonly languageClientFactory: LanguageClientFactory,
    ) {
        super(workspace, languages, languageClientFactory);
    }


    protected get globPatterns() {
        return [
            '**/*.xml'
        ];
    }

    protected onReady(languageClient: ILanguageClient): void {
        // handle content request
        languageClient.onRequest('vscode/content', async (uriPath: string) => {
            const uri = new URI(uriPath);
            const resource = await this.resourceProvider(uri);
            const text = await resource.readContents();
            return text;
        });
        super.onReady(languageClient);
    }
    createOptions() {
        const options = super.createOptions();
        options.middleware =  {
            workspace: {
                didChangeConfiguration: () => {
                    this.languageClient.then(client => {
                        client.sendNotification(DidChangeConfigurationNotification.type, { settings: this.getSettings() });
                    });
                }
            }
        }
        return options;
    }

    getSettings(): JSON {
        const configXML = this.workspace.configurations!.getConfiguration('xml');
        let settings: JSON;
        if (!configXML) {
          const defaultValue = {
            trace: {
              server: 'verbose'
            },
            logs: {
              client: true
            },
            format: {
              enabled: true,
              splitAttributes: false
            }
          }
          const x = JSON.stringify(defaultValue);
          settings = JSON.parse(x);
        } else {
          const x = JSON.stringify(configXML);
          settings = JSON.parse(x);
        }
        return settings;
    }
}