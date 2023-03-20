import multer from "multer";
import { PredictionAPIClient } from "@azure/cognitiveservices-customvision-prediction";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/temp",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).array("images");

export default function handler(req, res) {
  const endpoint = "https://aiutesa-prediction.cognitiveservices.azure.com/";
  const projectId = "ca45880e-d4bb-45d3-8287-c186c1404dd4";
  const iteration = "ClasificacionFlores";
  const credentials = new ApiKeyCredentials({
    inHeader: { "Prediction-key": "bf6a1ebaaae04f6ba665e5028bcc28fd" },
  });

  const requestId = new Date().getTime();
  new Promise((resolve, reject) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      const result = [];
      try {
        const client = new PredictionAPIClient(credentials, endpoint);
        const reqPath = path.join("public", "uploads", `${requestId}`);
        await fse.mkdir(reqPath, {
          recursive: true,
        });
        for (let file of req.files) {
          const imagePath = path.join(
            "public",
            "uploads",
            "temp",
            file.filename
          );
          const buffer = await fs.readFileSync(imagePath);
          const data = await client.classifyImage(projectId, iteration, buffer);
          await fse.mkdir(path.join(reqPath, data.predictions[0].tagName), {
            recursive: true,
          });
          await fse.move(
            imagePath,
            path.join(reqPath, data.predictions[0].tagName, file.filename)
          );
          result.push({
            image: file.originalname,
            classification: data.predictions[0].tagName,
            trust: data.predictions[0].probability,
          });
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  })
    .then((data) => {
      res.status(200).json({ id: requestId, data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
