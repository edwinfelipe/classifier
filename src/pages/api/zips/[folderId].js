import { zip } from "zip-a-folder";
import fse from "fs-extra";
import path from "path";
export default function handler(req, res) {
  const { folderId } = req.query;
  const from = path.join("public", "uploads", folderId);
  const to = path.join("public", "uploads", "zips", `${folderId}.zip`);
  fse.exists(to).then((exists) => {
    if (exists) {
      res.status(208).json({ success: true });
    } else {
      zip(from, to)
        .then(() => {
          return res.status(200).json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ success: false });
        });
    }
  });
}
