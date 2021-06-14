import { WorkspaceEdit, WorkspaceFolder, ExtensionContext, Uri, Position, workspace } from "vscode";
import * as fsextra from "fs-extra";

export default class FileCreator {

    workspaceEdit: WorkspaceEdit;
    context: ExtensionContext;

    constructor(workspaceEdit: WorkspaceEdit, context: ExtensionContext) {
        this.workspaceEdit = workspaceEdit;
        this.context = context;
    }

    async addFileToCreate(sourceUri: Uri, destUri: Uri, overwrite: boolean = false, ignoreIfExists: boolean = true) {

        // get the source file content
        const sourceContent = await fsextra.readFile(sourceUri.fsPath, "utf-8");


        // create the schema cds file inside the target project workspace
        this.workspaceEdit.createFile(destUri, {
            overwrite,
            ignoreIfExists
        });

        this.workspaceEdit.insert(destUri, new Position(0, 0), sourceContent, { needsConfirmation: false, label: "" });
    }

    async addFileToCreateBySource(sourceContent: string, destUri: Uri, overwrite: boolean = false, ignoreIfExists: boolean = true) {

        // create the schema cds file inside the target project workspace
        this.workspaceEdit.createFile(destUri, {
            overwrite,
            ignoreIfExists
        });

        this.workspaceEdit.insert(destUri, new Position(0, 0), sourceContent, { needsConfirmation: false, label: "" });
    }

    /**
     * This function will perform the copy operation of all 
     * the files we 
     */
    apply() {
        return workspace.applyEdit(this.workspaceEdit);
    }

}