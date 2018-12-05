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

import { LanguageGrammarDefinitionContribution, TextmateRegistry } from "@theia/monaco/lib/browser/textmate";
import { injectable } from "inversify";
import { XML_LANGUAGE_ID } from "../common";

@injectable()
export class XmlGrammarContribution implements LanguageGrammarDefinitionContribution {

    readonly config: monaco.languages.LanguageConfiguration = {
        comments: {
            blockComment: ["<!--", "-->"]
        },
        brackets: [
            ["<", ">"]
        ],
        autoClosingPairs: [
            { open: "<", close: ">" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ],
        surroundingPairs: [
            { open: "<", close: ">" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ]
    };

    registerTextmateLanguage(registry: TextmateRegistry) {
        monaco.languages.register({
            id: XML_LANGUAGE_ID,
            "aliases": [
                "XML",
                "xml"
            ],
            "extensions": [
                ".xml"
            ],
            "firstLine": "(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)"
        });

        monaco.languages.setLanguageConfiguration(XML_LANGUAGE_ID, this.config);
        if (registry.getProvider('text.xml') == undefined) {
            const xmlGrammar = require('../../data/xml.tmLanguage.json');
            registry.registerTextmateGrammarScope('text.xml', {
                async getGrammarDefinition() {
                    return {
                        format: 'json',
                        content: xmlGrammar
                    };
                }
            });
        }
        registry.mapLanguageIdToTextmateGrammar(XML_LANGUAGE_ID, 'text.xml');
    }
}