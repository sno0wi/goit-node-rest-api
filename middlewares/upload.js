import path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = req.user.id;

    const filename = `${basename}--${suffix}${extname}`;

    cb(null, filename);
  },
});

export default multer({ storage });
