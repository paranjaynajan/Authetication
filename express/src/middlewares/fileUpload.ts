import multer from "multer";
import fs from "fs";
import path from "path";

const pathtofolder=path.join(__dirname,"../../uploads")


const storage = multer.diskStorage({
  destination: (req, File, cb) => {
    const profileImageuploadPath = './uploads';
    if (!fs.existsSync(profileImageuploadPath)) {
      fs.mkdirSync(profileImageuploadPath);
    }
    cb(null, path.join(pathtofolder, '/profileImages'));
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

export const fileImage = multer({
  storage: storage,
});





