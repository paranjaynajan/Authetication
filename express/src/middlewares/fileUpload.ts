import multer from "multer";
import fs from "fs";
import path from "path";

const a=path.join(__dirname,"../../uploads")

console.log(a,"path")
const storage = multer.diskStorage({
  destination: (req, File, cb) => {
    const profileImageuploadPath = a;

    if (!fs.existsSync(profileImageuploadPath)) {
      fs.mkdirSync(profileImageuploadPath);
    }
  },
  filename: (req, File, cb) => {},
});

export const fileImage = multer({
  storage: storage,
});
