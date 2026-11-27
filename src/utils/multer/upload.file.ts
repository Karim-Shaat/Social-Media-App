import multer, { diskStorage, memoryStorage } from "multer";
import fs from "fs/promises";

export enum StorageTypeEnum {
  hard,
  memory,
}

export const uploadFile = ( {dest = "/general", storageType = StorageTypeEnum.hard}:{dest?: string , storageType?: StorageTypeEnum }) => {
  let storage;
  if (storageType == StorageTypeEnum.hard) {
        storage = diskStorage({
        destination: async (req, file, cp) => {
            const userId = req.user?._id || "";
            const folderName = `./uploads/${dest}/${userId}`;
            try {
            await fs.access(folderName);
            } catch (error) {
            await fs.mkdir(folderName, {
                recursive: true,
            });
            }
            cp(null, folderName);
        },
        filename: (req, file, cp) => {
            const userName = req.user?.userName || "";
            const fileName = userName + "_" + Date.now() + "_" + file.originalname;
            cp(null, fileName);
        },
        });
    }else{
        storage = memoryStorage();
    }

  return multer({
    storage,
  });
};
