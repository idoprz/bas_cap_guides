import * as vscode from 'vscode';
import { ISnippet } from '@sap-devx/code-snippet-types';
import * as _ from 'lodash';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { bas, ICommandAction,ISnippetAction, IExecuteAction } from '@sap-devx/bas-platform-types';
import * as os from "os";
import { URL } from "url";

const datauri = require("datauri");

const EXT_ID = "saposs.bas-cap-guides";

let openWizardAction: IExecuteAction;
let showMessageAction: IExecuteAction;
let cloneAction: IExecuteAction;
let createFileAction: IExecuteAction;
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

    let collection2: ICollection = {
        id: "createBasicApplication",
        title: "Consume an external service with you SAP Cloud application",
        description: "This guide will walk you through the diffrent steps required for consuming external services.",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.mashup_external_service",
        ]
    };
    collections.push(collection2);


    let collection3: ICollection = {
        id: "createBasicApplication",
        title: "Add an SAP Fiori UI to your SAP Cloud application",
        description: "This guide will walk you through the diffrent steps required for adding an SAP Fiori UI to your cloud Application",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.add_fiori_ui",
        ]
    };
    collections.push(collection3);

    let collection4: ICollection = {
        id: "createBasicApplication",
        title: "Deploy your Application to SAP Cloud Platform",
        description: "This guide will walk you through the diffrent steps needed for deploying your Application to SAP Cloud Platform",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.deploy_application",
        ]
    };
    collections.push(collection4);

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
            action: createFileAction
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
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "add_initial_data",
        title: "Add initial data to your bookshop application",
        description: "In this step you will define the bookshop application service which serves the books data.",
        action1: { 
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);
    item = {
        id: "add_custom_logic",
        title: "Add custom logic to your application",
        description: "In this step you will define the bookshop application service which serves the books data.",
        action1: { 
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);
    item = {
        id: "application_test_run",
        title: "Test run our application",
        description: "In this step you will define the bookshop application service which serves the books data.",
        action1: { 
            name: "Open",
            action: openGlobalSettingsAction
        },
        labels: [
        ]
    };
    items.push(item);




    item = {
        id: "mashup_external_service",
        title: "Mashup with external service",
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
            action: openGlobalSettingsAction
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

    bookshopSchemaAction = new basAPI.actions.SnippetAction()
    bookshopSchemaAction.contributorId = EXT_ID;
    bookshopSchemaAction.snippetName = "snippet_1";
    bookshopSchemaAction.context = {};


    openWizardAction = new basAPI.actions.ExecuteAction();
    openWizardAction.executeAction  = () => {
        return vscode.commands.executeCommand("sapbas.showProjectTemplates");
    };

    showMessageAction = new basAPI.actions.ExecuteAction();
    showMessageAction.executeAction  = () => {
        return vscode.window.showInformationMessage("Hello from Open Global Settings item");
    };

    createFileAction = new basAPI.actions.ExecuteAction();
    createFileAction.executeAction  = createFile;

    cloneAction = new basAPI.actions.ExecuteAction();
    cloneAction.executeAction  = () => {
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

    const api = {
		getCodeSnippets(context: any) {
			const snippets = new Map<string, ISnippet>();
			let snippet: ISnippet = {
				getMessages() {
					return {
						title: "Create Grocery List",
						description: "Create an organized grocery list to avoid buying items you don't really need.",
						applyButton: "Create"
					};
				},
				async getQuestions() {
					return createCodeSnippetQuestions(context);
				},
				async getWorkspaceEdit(answers: any) {
					return createCodeSnippetWorkspaceEdit(answers, context);
				}
			}
			snippets.set("snippet_1", snippet);
			return snippets;
		},
    };

    return api;
}





async function createCodeSnippetWorkspaceEdit(answers: any, context: any) {

    
    const docUri: vscode.Uri = vscode.Uri.parse(vscode.Uri.file(os.homedir()) + vscode.Uri.file(path.sep + ".git-credentials").path);
	const we = new vscode.WorkspaceEdit();
	we.createFile(docUri, { ignoreIfExists: true });

    const url = new URL(answers.url);
    const username = encodeURIComponent(answers.path);
    const password = encodeURIComponent(answers.address);
    const newText = `${url.protocol}//${username}:${password}@${url.host}`;
    we.insert(docUri, new vscode.Position(0, 0), newText + '\n');

	return we;
}


function createCodeSnippetQuestions(context: any) : any[] {
	const questions: any[] = [];

    questions.push(
		{
		  guiOptions: {
			hint: "Add your favorite groceries to the list."
		  },
		  type: "checkbox",
		  name: "groceries",
		  message: "Groceries",
		  choices: [
			'Banana',
			'Orange',
			'Carrot',
			'Bread',
			'Pasta',
			'Rice',
			'Milk',
			'Yogurt',
			'Cheese'
		  ]
		},
		{
		  guiOptions: {
			hint: "Select the folder to which you want to save the grocery list.",
			type: "folder-browser",
		  },
		  type: "input",
		  name: "path",
		  message: "Target Folder",
		  default: "/home/user/projects"
        },
		{
            guiOptions: {
                hint: "Do you want the groceries delivered to your home?",
            },
            type: "confirm",
            name: "isDelivery",
            message: "Delivery",
            default: false
        },
        {
            guiOptions: {
                hint: "Provide the address for delivery.",
            },
            type: "input",
            name: "address",
            message: "Address",
            when: function (answers: any) {
              return answers.isDelivery;
            }
        },
        {
            guiOptions: {
                hint: "Provide your phone number.",
            },
            type: "input",
            name: "phoneNumber",
            message: "Phone Number",
            when: function (answers: any) {
              return answers.isDelivery;
            },
            validate: function (value: any) {
                return value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) ? true : "Enter valid phone number.";
              }
          }
      );
  
    return questions;
}

function getImage(imagePath: string) :string {
    let image;
    try {
      image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}

function createFile(){
    return new Promise((resolve, reject)=>{​​​​
    const wsedit = new vscode.WorkspaceEdit();
    if(vscode.workspace.workspaceFolders){
        const wsPath =vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
        const filePath = vscode.Uri.file(wsPath + '/hello/world.md');
        vscode.window.showInformationMessage(filePath.toString());
        wsedit.createFile(filePath, { ignoreIfExists: true });
        vscode.workspace.applyEdit(wsedit);
        vscode.window.showInformationMessage('Created a new file: hello/world.md');
    };

    resolve();
          });
}

export function deactivate() {}
