/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { StyleSheet } from 'react-native';
export default AmplifyTheme = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 0,
        width: '100%',
    },
    section: {
        flex: 1,
        width: '100%',
    },
    sectionHeader: {},
    sectionHeaderText: {
        width: '100%',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '500'
    },
    sectionFooter: {
        width: '100%',
        marginTop: 15,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    sectionFooterLink: {
        fontSize: 14,
        color: '#007bff',
        alignItems: 'flex-start',
        textAlign: 'center'
    },
    sectionBody: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionBodyTop: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    cell: {
        flex: 1,
        width: '50%'
    },
    errorRow: {
        
    },
    erroRowText: {
        color: '#f6af46',
        paddingLeft: 20,
        paddingRight: 20,
    },
    erroRowTextDark: {
        color: '#4d2643',
        paddingLeft: 20,
        paddingRight: 20,
    },

    photo: {
        width: '100%'
    },
    album: {
        width: '100%'
    },

    a: {},
    button: {
        width: 229,
        height: 43,
        borderRadius: 26.5,
        backgroundColor: "#ffffff",
        marginTop: 15,
        marginBottom: 15,
    },
    tagline: {
        fontSize: 32,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 46,
        letterSpacing: 0,
        color: "#ffffff",
        width: '100%',
        marginLeft: 60,
        marginTop: 10,
        marginBottom: 30,
        textAlign: "left",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.75,
        textAlign: "center",
        color: "#373744",
        width: '100%'
    },

    login: {
        margin: 6,
        borderRadius: 26.5,
        backgroundColor: "rgba(0, 0, 0, 0.32)",
        width: 265,
        height: 43,
        color: '#ffffff',
        textAlign: 'center'
    },
    input: {
        margin: 6,
        borderRadius: 6,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        width: 312,
        height: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#353131",
    }
});