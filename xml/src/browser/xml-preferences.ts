
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
import { JsonSchemaConfiguration } from '@theia/core/lib/browser/json-schema-store';

export const XMLConfigSchema: PreferenceSchema = {
    'type': 'object',
    "properties": {
        "xml.schemas": {
            "type": "array",
            'items': {
                'type': 'object',
                'default': {
                    'fileMatch': [
                        '/myfile'
                    ],
                    'url': 'schemaURL'
                },
                'properties': {
                    'url': {
                        'type': 'string',
                        'default': '/user.schema.json',
                        'description': 'A URL to a schema or a relative path to a schema in the current directory'
                    },
                    'fileMatch': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'default': 'MyFile.xsd',
                            'description': 'A file pattern that can contain \'*\' to match against when resolving files to schemas.'
                        },
                        'minItems': 1,
                        'description': 'An array of file patterns to match against when resolving files to JSON schemas.'
                    }
                }
            },
            "description": "Associate schemas to files in the current workspace"
        }
    }
};

export interface XMLConfiguration {
    'xml.trace.server': 'off'|'messages'|'verbose',
    'xml.schemas': JsonSchemaConfiguration[]
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