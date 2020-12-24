"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fsextra = require("fs-extra");
class FileCreator {
    constructor(workspaceEdit, context) {
        this.workspaceEdit = workspaceEdit;
        this.context = context;
    }
    addFileToCreate(sourceUri, destUri, overwrite = false, ignoreIfExists = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the source file content
            const sourceContent = yield fsextra.readFile(sourceUri.fsPath, "utf-8");
            // create the schema cds file inside the target project workspace
            this.workspaceEdit.createFile(destUri, {
                overwrite,
                ignoreIfExists
            });
            this.workspaceEdit.insert(destUri, new vscode_1.Position(0, 0), sourceContent, { needsConfirmation: false, label: "" });
        });
    }
    /**
     * This function will perform the copy operation of all
     * the files we
     */
    apply() {
        vscode_1.workspace.applyEdit(this.workspaceEdit);
    }
}
exports.default = FileCreator;
//# sourceMappingURL=fileCreator.js.map