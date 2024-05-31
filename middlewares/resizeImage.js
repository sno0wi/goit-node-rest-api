import Jimp from "jimp";

function resizeImage(req, res, next) {
  if (req.file === undefined) {
    return res
      .status(400)
      .send({ message: "Please select an avatar to proceed." });
  }
  const imagePath = req.file.path;
  Jimp.read(imagePath)
    .then((image) => {
      return image.resize(250, 250).write(imagePath);
    })
    .then(() => {
      next();
    })
    .catch((err) => {
      console.error("Error resizing image:", err);
      res.status(500).send("Error resizing image");
    });
}

export default resizeImage;
