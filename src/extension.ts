import * as vscode from 'vscode';
import { ISnippet } from '@sap-devx/code-snippet-types';
import * as _ from 'lodash';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { bas, ICommandAction, ISnippetAction, IExecuteAction } from '@sap-devx/bas-platform-types';
import * as os from "os";
import { URL } from "url";
import * as fsextra from "fs-extra";
import FileCreator from './fileCreator';
import { cwd } from 'process';
const homeDir = require('os').homedir();
const datauri = require("datauri");

const EXT_ID = "saposs.bas-cap-guides";

let openWizardAction: IExecuteAction;
let showMessageAction: IExecuteAction;
let cloneAction: IExecuteAction;
let createSchema: IExecuteAction;
let createService: IExecuteAction;
let createCSV: IExecuteAction;
let createBusinessLogic: IExecuteAction;
let application_test_run: IExecuteAction;
let openGlobalSettingsAction: ICommandAction;
let showInfoMessageAction: IExecuteAction;
let extensionPath: string;

var path = require('path');

let bookshopSchemaAction: ISnippetAction;


function getCollections(): ICollection[] {
    const collections: Array<ICollection> = [];


    let collection: ICollection = {
        id: "createBasicApplication",
        title: "Create a simple S/4HANA Extension using CAP Node.js",
        description: "Create a simple S/4HANA Extension using CAP Node.js",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.create_project",
            "saposs.bas-cap-guides.mashup_external_service",
            "saposs.bas-cap-guides.add_fiori_ui",
            "saposs.bas-cap-guides.test_with_mock",
            "saposs.bas-cap-guides.test_with_real",
            "saposs.bas-cap-guides.deploy_application",
        ]
    };

    collections.push(collection);

    return collections;
}

function getItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "create_project",
        title: "Start with creating a new CAP project",
        description: "The application you’ll develop is a simple Bookshop app that consists of a data model with three entities:<BR>- <B>Books</B><BR>- <B>Authors</B><BR>- <B>Orders</B><BR>The data model is exposed via the Catalog Service.<BR>The application has some initial data that is used for testing the application, and some custom logic that runs after reading the books from the Books entity.<BR>Once you have all the code in place, you will test the application locally.",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'books_img.png')),
            note: "CAP new project from template"
        },
        itemIds: [
            "saposs.bas-cap-guides.create_from_template",
            "saposs.bas-cap-guides.define_bookshop_schema",
            "saposs.bas-cap-guides.define_bookshop_service",
            "saposs.bas-cap-guides.add_initial_data",
            "saposs.bas-cap-guides.add_custom_logic",
            "saposs.bas-cap-guides.application_test_run",

        ],
        labels: [

        ]
    };
    items.push(item);

    item = {
        id: "create_from_template",
        title: "Create a new Cloud Application project from template",
        description: "Create a New Project from template, generating your cloud application project skelaton:<BR><BR> - Select the CAP Project template, and click Next<BR> - Enter <b>bookshop</b> as the name for the project<BR>",
        action1: {
            name: "Create",
            title: "Create new CAP project",
            action: openWizardAction
        },
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'wizard.png')),
            note: "CAP new project from template"
        },
        labels: []
    };
    items.push(item);

    item = {
        id: "define_bookshop_schema",
        title: "Define the Bookshop schmema",
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR> - Books<BR> - Authors<BR> - Geners",
        action1: {
            name: "Create schema",
            action: createSchema
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "define_bookshop_service",
        title: "Define the Bookshop service",
        description: "In this step you will define the bookshop application service which serves the books data.",
        action1: {
            name: "Create service",
            action: createService
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "add_initial_data",
        title: "Add initial data to your bookshop application",
        description: "In this step you will add initial data of <b>books</b> and <b>authors</bb> which will help us with testing the application.",
        action1: {
            name: "Add initial data",
            action: createCSV
        },
        labels: [
        ]
    };
    items.push(item);
    item = {
        id: "add_custom_logic",
        title: "Add custom logic to your application",
        description: "In this step you will define the bookshop application service business logic, which will allow applying a discount for specific books.",
        action1: {
            name: "Add custom logic",
            action: createBusinessLogic
        },
        labels: [
        ]
    };
    items.push(item);
    item = {
        id: "application_test_run",
        title: "Test run our application",
        description: "In this step you will test run your application, by running it on yiur developer workspace, serving the bookshop data with your bookshop service.<BR> you will first run <b>npm install</b> for installing all application dependencies, and then use the <b>Run Configuration Tool</b> for running your application.",
        action1: {
            name: "Test run",
            action: application_test_run
        },
        labels: [
        ]
    };
    items.push(item);




    item = {
        id: "mashup_external_service",
        title: "Mashup with external service",
        description: "Open the command palette and start typing <b>consume SAP services</b><BR>Choose <b>Consume SAP Services</b><BR>Choose the <b>Business Application folder</b><BR>Choose <b>SAP API Business Hub</b><BR>Choose <b>SAP_API_Business_Hub as the destination</b><BR>Choose <b>Business Partner(A2X)</b><BR>Enter your username and password</b><BR>You should get a notification the action was successful and see new edmx and csn files (metadata.xml and metadata.json) in a new external folder under the bookshop srv folder",
        action1: {
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "add_fiori_ui",
        title: "Add an SAP Fiori UI",
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR> - Books<BR> - Authors<BR> - Geners",
        action1: {
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "test_with_mock",
        title: "Test your application with Mock data",
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR> - Books<BR> - Authors<BR> - Geners",
        action1: {
            name: "Open",
            action: application_test_run
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "test_with_real",
        title: "Test your application with live backend data",
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR> - Books<BR> - Authors<BR> - Geners",
        action1: {
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "deploy_application",
        title: "Deploy your application to SAP Cloud Platform",
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR> - Books<BR> - Authors<BR> - Geners",
        action1: {
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    
    items.push(item);
    return items;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "cap_bas_guides" is now active!');
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;

    extensionPath = context.extensionPath;



    openWizardAction = new basAPI.actions.ExecuteAction();
    openWizardAction.executeAction = () => {
        return vscode.commands.executeCommand("sapbas.showProjectTemplates");
    };

    showMessageAction = new basAPI.actions.ExecuteAction();
    showMessageAction.executeAction = () => {
        return vscode.window.showInformationMessage("Hello from Open Global Settings item");
    };

    createSchema = new basAPI.actions.ExecuteAction();
    createSchema.executeAction = async () => {
        return new Promise(async (resolve, reject) => {
            const we = new vscode.WorkspaceEdit();

            // get the target project workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length ? vscode.workspace.workspaceFolders[0] : undefined;

            if (!workspaceFolder) {
                vscode.window.showErrorMessage("Cannot find folder");
                reject('Cannot find folder');
                return;
            }

            const fileCreator = new FileCreator(we, context);

            // create schema.cds file using the file creator api
            const schemaCdsDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/schema.cds`);
            const schemaDestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/schema.cds`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(schemaCdsDocUri, schemaDestUri, true, false);


            // ... Now we can add more files (like the csv files) using the addFileToCreate function 
            // const authorsCdsDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Authors.csv`);
            // const authorsCsvDestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Authors.csv`);
            // fileCreator.addFileToCreate(authorsCdsDocUri, authorsCsvDestUri, true, false);

            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");



            
        });
    };

    createService = new basAPI.actions.ExecuteAction();
    createService.executeAction = async () => {
        return new Promise(async (resolve, reject) => {
            const we = new vscode.WorkspaceEdit();

            // get the target project workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length ? vscode.workspace.workspaceFolders[0] : undefined;

            if (!workspaceFolder) {
                vscode.window.showErrorMessage("Cannot find folder");
                reject('Cannot find folder');
                return;
            }

            const fileCreator = new FileCreator(we, context);

            // create schema.cds file using the file creator api
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/cat-service.cds`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/srv/cat-service.cds`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, false);


            // ... Now we can add more files (like the csv files) using the addFileToCreate function 
            // const authorsCdsDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Authors.csv`);
            // const authorsCsvDestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Authors.csv`);
            // fileCreator.addFileToCreate(authorsCdsDocUri, authorsCsvDestUri, true, false);

            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");



            
        });
    };

    createCSV = new basAPI.actions.ExecuteAction();
    createCSV.executeAction = async () => {
        return new Promise(async (resolve, reject) => {
            const we = new vscode.WorkspaceEdit();

            // get the target project workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length ? vscode.workspace.workspaceFolders[0] : undefined;

            if (!workspaceFolder) {
                vscode.window.showErrorMessage("Cannot find folder");
                reject('Cannot find folder');
                return;
            }

            const fileCreator = new FileCreator(we, context);

            // create schema.cds file using the file creator api
            const CSV1DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Authors.csv`);
            const CSV1DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Authors.csv`);
            const CSV2DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Books.csv`);
            const CSV2DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Books.csv`);
            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(CSV1DocUri, CSV1DestUri, true, false);
            await fileCreator.addFileToCreate(CSV2DocUri, CSV2DestUri, true, false);

            // ... Now we can add more files (like the csv files) using the addFileToCreate function 
            // const authorsCdsDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Authors.csv`);
            // const authorsCsvDestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Authors.csv`);
            // fileCreator.addFileToCreate(authorsCdsDocUri, authorsCsvDestUri, true, false);

            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");



            
        });
    };

    createBusinessLogic = new basAPI.actions.ExecuteAction();
    createBusinessLogic.executeAction = async () => {
        return new Promise(async (resolve, reject) => {
            const we = new vscode.WorkspaceEdit();

            // get the target project workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length ? vscode.workspace.workspaceFolders[0] : undefined;

            if (!workspaceFolder) {
                vscode.window.showErrorMessage("Cannot find folder");
                reject('Cannot find folder');
                return;
            }

            const fileCreator = new FileCreator(we, context);

            // create schema.cds file using the file creator api
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/cat-service.js`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/srv/cat-service.js`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, false);


            // ... Now we can add more files (like the csv files) using the addFileToCreate function 
            // const authorsCdsDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/my-bookshop-Authors.csv`);
            // const authorsCsvDestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/db/data/my-bookshop-Authors.csv`);
            // fileCreator.addFileToCreate(authorsCdsDocUri, authorsCsvDestUri, true, false);

            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");



            
        });
    };

    
    application_test_run = new basAPI.actions.ExecuteAction();
    application_test_run.executeAction = () => {

        // change focus of run config
        vscode.commands.executeCommand("runConfigurations.focus");

        // run npm install task
        let options: vscode.ShellExecutionOptions = {cwd: homeDir};
        let execution = new vscode.ShellExecution("npm install", options);
        let task = new vscode.Task(
            { type: 'shell' },
            vscode.TaskScope.Workspace,
            'npm install',
            'npm',
            execution);
        
        vscode.tasks.executeTask(task);
        
       return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
       
    }

    cloneAction = new basAPI.actions.ExecuteAction();
    cloneAction.executeAction = () => {
        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
    };

    openGlobalSettingsAction = new basAPI.actions.CommandAction();
    openGlobalSettingsAction.name = "workbench.action.openGlobalSettings";

    showInfoMessageAction = new basAPI.actions.ExecuteAction();
    showInfoMessageAction.executeAction = () => {
        return vscode.window.showInformationMessage("Hello from guided development item");
    };

    basAPI.getExtensionAPI<ManagerAPI>("SAPOSS.guided-development").then((managerAPI) => {
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

}








function getImage(imagePath: string): string {
    let image;
    try {
        image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}



export function deactivate() { }
