import * as vscode from 'vscode';
import { ISnippet } from '@sap-devx/code-snippet-types';
import * as _ from 'lodash';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { bas, ICommandAction, ISnippetAction, IExecuteAction } from '@sap-devx/app-studio-toolkit-types';
import * as os from "os";
import { URL } from "url";
import * as fsextra from "fs-extra";
import FileCreator from './fileCreator';
import { cwd } from 'process';
import { open, openSync } from 'fs';
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
let consumeSAPServices : IExecuteAction;
let updateServiceCDS : IExecuteAction;
let addBPLogic : IExecuteAction;
let importBBPCSV : IExecuteAction;
let addAnnotations : IExecuteAction;
let createProdProfile : IExecuteAction;
let fileExplorerFocus : IExecuteAction;
let openGlobalSettingsAction: ICommandAction;
let showInfoMessageAction: IExecuteAction;
let extensionPath: string;

var path = require('path');

let bookshopSchemaAction: ISnippetAction;


function getCollections(): ICollection[] {
    const collections: Array<ICollection> = [];


    let tutorialCollection: ICollection = {
        id: "tutoailApplication",
        title: "Tutorial - Create a simple S/4HANA Extension using CAP Node.js",
        description: "Create a simple S/4HANA Extension using CAP Node.js",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.create_project",
            "saposs.bas-cap-guides.extend_application",
            "saposs.bas-cap-guides.add_fiori_ui",
            "saposs.bas-cap-guides.test_with_mock",
            "saposs.bas-cap-guides.test_with_real",
            "saposs.bas-cap-guides.deploy_application",
        ]
    };

    collections.push(tutorialCollection);

    let fioriCollection: ICollection = {
        id: "fioriApplication",
        title: "Add Fiori UI to your CAP cloud application",
        description: "Use Fiori tools for adding a Fiori UI served by your project CAP services",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.create_fiori_application",
        ]
    };

    collections.push(fioriCollection);


    let deploymentCollection: ICollection = {
        id: "deployApplication",
        title: "Deploy your application to SAP Business Technology Platform",
        description: "Bulid and deploy your application to SAP BTP",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.deploy_application",
        ]
    };

    collections.push(deploymentCollection);


    let mashupCollection: ICollection = {
        id: "deployApplication",
        title: "Import an external service data model",
        description: "Import an external service definition and mesh it with your application services",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.bas-cap-guides.import_data_model_stadalone",
        ]
    };

    collections.push(mashupCollection);
    return collections;
}

function getItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "create_project",
        title: "Start by creating a new CAP project",
        description: "The application you’ll develop is a simple Bookshop app that consists of a data model with three entities:<BR><BR>- <B>Books</B><BR>- <B>Authors</B><BR>- <B>Orders</B><BR>The data model is exposed via the Catalog Service.<BR>The application has some initial data that is used for testing the application, and some custom logic that runs after reading the books from the Books entity.<BR>Once you have all the code in place, you will test the application locally.",
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
        description: "Create a New Project from template, generating your cloud application project skelaton:<BR><BR> - Select the CAP Project template, and click Next<BR> - Enter <b>bookshop</b> as the name for the project<BR> - Click on <b>Finish</b> to generate your project",
        action1: {
            name: "Create",
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
        description: "In this step you will define the bookshop application data schmea which is composed out of three main entities: <BR><BR> - Books<BR> - Authors<BR> - Genres",
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
        description: "In this step you will add initial data of <b>Books</b> and <b>Authors</bb> which will help us with testing running the application. The initial data is stored in CSV files which will be automatically read by bookshop application service",
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
        description: "In this step you will test run your application, by running it on your developer workspace, serving the bookshop data with your bookshop service.<BR> You will first run <b>npm install</b> for installing all application dependencies, and then use the <b>Run Configuration Tool</b> for running your application. <BR><BR> 1.	From the left side menu, open the Run Configurations view<BR> 2. Click <b>+</b> at the top of the view to add a new configuration.<BR> 3. Select <b>bookshop(CAP)</b> as the runnable application from the command palette prompt<BR>4. Press Enter to use the default name for the configuration. A new configuration is added to the run configuration tree<BR>5.	Click the <b>right green arrow</b> on the right of the configuration name to run the application<BR>6. When prompted, click <b>Expose and Open</b> for port <b>4004</b>, port 4004 the application is running on is exposed to external access, in this case, to the browser<BR>7. Press Enter to use the default description. The application opens in the browser and you can click to see the metadata and entities of the service",
        action1: {
            name: "Test run",
            action: application_test_run
        },
        labels: [
        ]
    };
    items.push(item);


////////////////// part 2 Extend the application

item = {
    id: "extend_application",
    title: "Extend the application – mashup with SAP S/4HANA Cloud service",
    description: "In this section you will extend your bookshop application by mashing up your service with an SAP S/4HANA cloud service (Business Partner service) ",
    image: {
        image: getImage(path.join(extensionPath, 'resources', 'external_service.png')),
        note: "S/4Hana cloud mashup"
    },
    itemIds: [
        "saposs.bas-cap-guides.import_data_model",
        "saposs.bas-cap-guides.update_service_cds",
        "saposs.bas-cap-guides.add_bp_logic",
        "saposs.bas-cap-guides.import_bp_csv",
    ],
    labels: [

    ]
};
items.push(item);

    item = {
        id: "import_data_model",
        title: "Import an external data model",
        description: "1. Open the command palette and start typing <b>consume SAP services</b><BR>2. Choose <b>Consume SAP Services</b><BR>3. Choose the <b>Business Application folder</b><BR>4. Choose <b>SAP API Business Hub</b><BR>Choose <b>SAP_API_Business_Hub as the destination</b><BR>5. Choose <b>Business Partner(A2X)</b><BR>6. Enter your username and password</b><BR>You should get a notification the action was successful and see new edmx and csn files (metadata.xml and metadata.json) in a new external folder under the bookshop srv folder",
        action1: {
            name: "Add service",
            action: consumeSAPServices
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "update_service_cds",
        title: "Update service definition to consume the external service",
        description: "",
        action1: {
            name: "update service",
            action: updateServiceCDS
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "add_bp_logic",
        title: "Add custome logic ",
        description: "Add custome logic for reading the Business Partner service data",
        action1: {
            name: "Add logic",
            action: addBPLogic
        },
        labels: [
        ]
    };
    items.push(item);


    item = {
        id: "import_bp_csv",
        title: "Import mock data",
        description: "Import mock data to the Business Partner service by adding a CSV file to your appication external data model folder ",
        action1: {
            name: "import data",
            action: importBBPCSV
        },
        labels: [
        ]
    };
    items.push(item);


    //////////////////////////// part 3 -add Fiori UI

    item = {
        id: "add_fiori_ui",
        title: "Extend the application - Add an SAP Fiori UI",
        description: "In this section you will extend your bookshop application by adding an SAP Fiori List report application, interacting with your bookshop application service ",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'fiori_ui.png')),
            note: "Add fiori UI"
        },
        itemIds: [
            "saposs.bas-cap-guides.create_lrop_application",
            "saposs.bas-cap-guides.add_ui_annotations",
        ],
        labels: [
    
        ]
    };
    items.push(item);

    item = {
        id: "create_lrop_application",
        title: "Create an LROP FE application consuming the Catalog Service",
        description: "1. Open the <b>Project Explorer</b> and view your application <BR>2. Open the context menu on the CatalogService and choose create UI <BR>3. Select the <b>SAP Fiori Elements application generator</b> and click next <BR>4. Select the <b>Catalog Service</b> as the OData Service and click next <BR>5. Leave the default project attributes. The main entity used is Books. Click next <BR>6. Leave the defaults for the project name and title and click finish <BR>7. Under the <b>app</b> folder you should see the SAP Fiori application has been created.",
        action1: {
            name: "Done",
            action: openWizardAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "add_ui_annotations",
        title: "Add UI annotations",
        description: "Add UI annotations for defining your SAP Fiori applications table culomns",
        action1: {
            name: "Add annotations",
            action: addAnnotations
        },
        labels: [
        ]
    };
    items.push(item);

    //////////////////////////// part 4 -test with mock data

    item = {
        id: "test_with_mock",
        title: "Test your application with Mock data",
        description: "1.	From the left side menu, open the Run Configurations view<BR>2.	Open the run configuration you previously created. You should see a new dependency of OData kind.<BR>3.	To run the application using a mock server turn on this option from the run configuration (After the option is turned on you should see an indication the OData service is mocked.)<BR>4.	Click the right green arrow on the right of the configuration name to run the application.<BR>5.	When prompted, click Open (The application opens in the browser)<BR> 6.	click on the BusinessPartners entity to see the data returned by the mock server. <BR> 7.	Click on the link on the top to see the UI application. 8.	Click on the application tile, and then click on the Go button in the opened application. You should see the Books data presented in the UI <BR>9.	Stop the application by clicking Stop in the Debug pane.",
        action1: {
            name: "Open",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);

    //////////////////////////// part 5 -test with real data

    item = {
        id: "test_with_real",
        title: "Test your application with live backend data",
        description: "In this step you will connect your local bookshop application to <b>SAP Business Technology Platform<b> for consuming live data",
        
        itemIds: [
            "saposs.bas-cap-guides.create_production_profile",
            "saposs.bas-cap-guides.create_new_run_configuration",
            "saposs.bas-cap-guides.bind_hana_instance",
            "saposs.bas-cap-guides.open_hrtt",
            "saposs.bas-cap-guides.bind_s4hana_instance",
            "saposs.bas-cap-guides.run_the_application",
        ],
        labels: [
        ]
    };
    items.push(item);

    
    item = {
        id: "create_production_profile",
        title: "Create a production profile to run with",
        description: "In this step we will add a configuration profile for production testing (defined in the application package.json), defining the needed service dependencies:<BR><BR>– A dependency to kind ‘hana’<BR>- A dependency to the metadata OData service (that is already part of the package.json for the default profile)",
        action1: {
            name: "Create profile",
            action: createProdProfile
        },
        labels: [
        ]
    };
    items.push(item);



    item = {
        id: "create_new_run_configuration",
        title: "Create a new run configuration ",
        description: "1. From the left side menu, open the Run Configurations view<BR>2. Click on + at the top of the view to add a new configuration.<BR>3. Select the bookshop - production profile(cap)",
        action1: {
            name: "Create",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);


    item = {
        id: "bind_hana_instance",
        title: "Bind to SAP HANA instance",
        description: "The <b>Run Configuration</b> view allows you to bind to the specific <b>SAP HANA</b> instance with which you want your application to run, it will automatically install all the required dependencies and offer you to deploy your data model. (It actually generates a deploy task that you can run at any given time.)<BR><BR> 1.	Click the Bind icon to the right of the db dependency <BR>A list of SAP HANA service instances from your space is presented (you may need to log into Cloud Foundry).<BR> 2.	Select the SAP HANA service instance to which you want to bind the dependency (the bind action runs and the dependency is now bound)<BR>3.	After a few moments, a dialog box asking you to deploy your data model is displayed, choose <b>Yes</b> <BR> ",
        action1: {
            name: "Done",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);



    item = {
        id: "open_hrtt",
        title: "View database data using the HANA database explorer tool",
        description: "1. From the command palette type ‘HANA’ and select SAP HANA: open database explorer. The database explorer is opened in a new tab <BR>2. Click on the + button and select the SAP HANA Instance<BR>3. Click on the Tables node, to see a list of all available tables<BR>4. Click on the <b>MY_BOOKSHOP_AUTHORS</b> table and then on the <b>open data</b> button, to see the data.",
        action1: {
            name: "Done",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);


    item = {
        id: "bind_s4hana_instance",
        title: "Bind to an S/4HANA Cloud service",
        description: "1. Go back to the run configuration for the production profile<BR>2. Click the Bind icon to the right of the metadata dependency.<BR>3. Choose the destination that references the S/4HANA Cloud service",
        action1: {
            name: "Done",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);


    item = {
        id: "run_the_application",
        title: "Run the application",
        description: "1. Click the <b>right green arrow</b> on the right of the configuration name to run the application.<BR>2. When prompted, click <b>Open</b>. The application opens in the browser.<BR> 3. click on the <b>BusinessPartners</b> entity to see the data returned by the S/4HANA cloud service.<BR> 4. Click on the <b>Books</b> entity, to see the data retrieved from the SAP HANA instance",
        action1: {
            name: "Run application",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    items.push(item);





    //////////////////////////// part 5 -deploy your application to SAP Cloud Platform


    item = {
        id: "deploy_application",
        title: "Deploy your application to SAP Business Technology Platform",
        description: "1. From the terminal on the bookshop folder, run <b>cds add mta</b> command. This adds an <b>mta.yaml</b> file to the root of your application.<BR>2.	Right-click the <b>mta.yaml</b> file and choose Build MTA, a new folder for <b>mta_archives</b> is created containing the new mtar file<BR>3. Right-click the mtar file and choose <b>Deploy MTA Archive</b><BR><BR>Once the task is complete, your application should be available in your Cloud Foundry space.<BR>To access your application, go to your space in the <b>SAP Cloud Platform cockpit</b> and select <b>Applications</b> from the side menu ",
        action1: {
            name: "Done",
            action: fileExplorerFocus
        },
        labels: [
        ]
    };
    
    items.push(item);


    /////////////////////////// standalone items

    item = {
        id: "create_fiori_application",
        title: "Create an SAP Fiori application consuming one of your CAP Services",
        description: "1. Open the <b>Project Explorer</b> and view your application <BR>2. Open the context menu on the selected service and choose create UI <BR>3. Select the <b>SAP Fiori Elements application generator</b> and click next <BR>4. Select the target service as the OData Service and click next <BR>5. Leave the default project attributes. Choose the main entity and click next <BR>6. Leave the defaults for the project name and title and click finish <BR>7. Under the <b>app</b> folder you should see the SAP Fiori application has been created.",
        action1: {
            name: "Done",
            action: openWizardAction
        },
        labels: [
        ]
    };
    items.push(item);

    item = {
        id: "import_data_model_stadalone",
        title: "Import an external data model",
        description: "1. Open the command palette and start typing <b>consume SAP services</b><BR>2. Choose <b>Consume SAP Services</b><BR>3. Choose the <b>Business Application folder</b><BR>4. Choose the service source you would like to import<BR><BR>After import, you should get a notification the action was successful and see new edmx and csn files (metadata.xml and metadata.json) in a new external folder under the application srv folder",
        action1: {
            name: "Add service",
            action: consumeSAPServices
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
            await fileCreator.addFileToCreate(schemaCdsDocUri, schemaDestUri, true, true);


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");

            vscode.commands.executeCommand('vscode.open',schemaDestUri);

            
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
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);



            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");

            vscode.commands.executeCommand('vscode.open',DestUri);

            
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
            await fileCreator.addFileToCreate(CSV1DocUri, CSV1DestUri, true, true);
            await fileCreator.addFileToCreate(CSV2DocUri, CSV2DestUri, true, true);


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");

            vscode.commands.executeCommand('vscode.open',CSV1DestUri);
            vscode.commands.executeCommand('vscode.open',CSV2DestUri);
            
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
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);



            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");

            vscode.commands.executeCommand('vscode.open',DestUri);

            
        });
    };

    
    application_test_run = new basAPI.actions.ExecuteAction();
    application_test_run.executeAction = async() => {

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
       
    }

    consumeSAPServices = new basAPI.actions.ExecuteAction();
    consumeSAPServices.executeAction = () => {
        return vscode.commands.executeCommand("extension.consumeServicesCommand");
    };

    updateServiceCDS = new basAPI.actions.ExecuteAction();
    updateServiceCDS.executeAction = async () => {
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
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/cat-service_bp.cds`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/srv/cat-service.cds`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);


            // ... Now we can add more files (like the csv files) using the addFileToCreate function 

            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File updated successfully");
            vscode.commands.executeCommand('vscode.open',DestUri);


            
        });
    };


    addBPLogic = new basAPI.actions.ExecuteAction();
    addBPLogic.executeAction = async () => {
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
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/cat-service_bp.js`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/srv/cat-service.js`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File updated successfully");

            vscode.commands.executeCommand('vscode.open',DestUri);

            
        });
    };


    importBBPCSV = new basAPI.actions.ExecuteAction();
    importBBPCSV.executeAction = async () => {
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
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/metadata-A_BusinessPartner.csv`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/srv/external/data/metadata-A_BusinessPartner.csv`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);


            // ... Now we can add more files (like the csv files) using the addFileToCreate function 


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File created successfully");
            vscode.commands.executeCommand('vscode.open',DestUri);
        });
    };

    addAnnotations = new basAPI.actions.ExecuteAction();
    addAnnotations.executeAction = async () => {
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
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/annotations.cds`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/app/project1/annotations.cds`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File updated successfully");
            vscode.commands.executeCommand('vscode.open',DestUri);


            
        });
    };

    createProdProfile = new basAPI.actions.ExecuteAction();
    createProdProfile.executeAction = async () => {
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
            const DocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/resources/package_production.json`);
            const DestUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/package.json`);

            // here we add the schema. please notice that we are not creating the file now 
            // we just add it to the workspace edit in order to create it later
            // please make sure you call it with await since it reading the file content async inside
            await fileCreator.addFileToCreate(DocUri, DestUri, true, true);


            // finally, when we're ready to write the files we need to call the apply function 
            fileCreator.apply();
            vscode.window.showInformationMessage("File updated successfully");
            vscode.commands.executeCommand('vscode.open',DestUri);         
        });
    };

    fileExplorerFocus = new basAPI.actions.ExecuteAction();
    fileExplorerFocus.executeAction = async() => {

        // change focus of run config
        vscode.commands.executeCommand("runConfigurations.focus");
       
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
