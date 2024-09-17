import * as fs from "node:fs/promises";
import * as path from "node:path";

// define constants for patches and muffon folder
const patchesFolder = "./patches";
const muffonFolder = "./muffon";

// main function to patch files
async function patchFiles() {
    // read all files and directories in patches folder
    const files = await fs.readdir(patchesFolder, {
        withFileTypes: true,
    });

    // process each file/directory concurrently
    await Promise.all(
        files.map(async (file) => {
            // construct file paths
            const filePath = path.join(patchesFolder, file.name);
            const muffonFilePath = path.join(muffonFolder, file.name);

            // check if file is a directory
            if (file.isDirectory()) {
                // create corresponding directory in muffon folder
                await fs.mkdir(muffonFilePath, {
                    recursive: true,
                });

                // recursively patch files in subdirectory
                await patchFilesRecursive(filePath, muffonFilePath);
            } else {
                // copy file from patches to muffon folder
                await fs.copyFile(filePath, muffonFilePath);
            }
        }),
    );
}

// recursive function to patch files in subdirectories
async function patchFilesRecursive(srcDir, destDir) {
    // read all files and directories in source directory
    const files = await fs.readdir(srcDir, {
        withFileTypes: true,
    });

    // process each file/directory concurrently
    await Promise.all(
        files.map(async (file) => {
            // construct file paths
            const srcFilePath = path.join(srcDir, file.name);
            const destFilePath = path.join(destDir, file.name);

            // check if file is a directory
            if (file.isDirectory()) {
                // create corresponding directory in destination
                await fs.mkdir(destFilePath, {
                    recursive: true,
                });

                // recursively patch files in subdirectory
                await patchFilesRecursive(srcFilePath, destFilePath);
            } else {
                // copy file from source to destination
                await fs.copyFile(srcFilePath, destFilePath);
            }
        }),
    );
}

// call main function and catch any errors
patchFiles().catch((error) => {
    console.error("error patching files:", error);
});