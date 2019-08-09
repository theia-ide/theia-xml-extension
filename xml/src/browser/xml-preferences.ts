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

import { interfaces } from 'inversify';
import { createPreferenceProxy, PreferenceProxy, PreferenceService, PreferenceContribution, PreferenceSchema } from '@theia/core/lib/browser';

export const XMLConfigSchema: PreferenceSchema = {
    'type': 'object',
    "properties": {
        "xml.format.enabled": {
            "type": "boolean",
            "default": true,
            "description": "Enable/disable default XML formatter (requires restart)"
        },
        "xml.format.splitAttributes": {
            "type": "boolean",
            "default": false,
            "description": "Split multiple attributes each onto a new line"
        },
        "xml.format.joinCDATALines": {
            "type": "boolean",
            "default": false,
            "description": "Join lines in a CDATA tag's content"
        },
        "xml.format.spaceBeforeEmptyCloseTag": {
            "type": "boolean",
            "default": true,
            "description": "Insert space before end of self closing tag. \nExample:\n  <tag/> -> <tag />"
        },
        "xml.fileAssociations": {
            "type": "array",
            "default": [],
            "items": {
                "type": "object",
                "properties": {
                    "systemId": {
                        "type": "string",
                        "description": "The path or URL to the XML schema (XSD or DTD)"
                    },
                    "pattern": {
                        "type": "string",
                        "description": "File glob pattern. Example: **/*.Format.ps1xml\n\nMore information on the glob syntax: https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob",
                    }
                }
            },
            "description": "Allows XML schemas to be associated to file name patterns.\n\nExample:\n[{\n  \"systemId\": \"path/to/file.xsd\",\n  \"pattern\": \"file1.xml\"\n},\n{\n  \"systemId\": \"http://www.w3.org/2001/XMLSchema.xsd\",\n  \"pattern\": \"**/*.xsd\"\n}]",
        },
        "xml.logs.client": {
            "type": "boolean",
            "default": false,
            "description": "Enable/disable client log"
        },
        "xml.server.vmargs": {
            "type": "string",
            "default": "-noverify -Xmx64M -XX:+UseG1GC -XX:+UseStringDeduplication",
            "description": "Specifies extra VM arguments used to launch the XML Language Server. Eg. use `-noverify -Xmx1G  -XX:+UseG1GC -XX:+UseStringDeduplication` to bypass class verification, increase the heap size to 1GB and enable String deduplication with the G1 Garbage collector"
        },
    }
};

export interface XMLConfiguration {
    'xml.server.vmargs': 'string'
}

export const XMLPreferences = Symbol('XMLPreferences');
export type XMLPreferences = PreferenceProxy<XMLConfiguration>;

export function createXMLPreferences(preferences: PreferenceService): XMLPreferences {
    return createPreferenceProxy(preferences, XMLConfigSchema);
}

export function bindXMLPreferences(bind: interfaces.Bind): void {
    bind(XMLPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get<PreferenceService>(PreferenceService);
        return createXMLPreferences(preferences);
    });
    bind(PreferenceContribution).toConstantValue({ schema: XMLConfigSchema });
}
