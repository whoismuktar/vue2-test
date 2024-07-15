const { transformCSVData } = require("../util/util");

const multer = require("multer");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

export const jsonToExcel = (file) => {
  try {
    var workbook = XLSX.readFile(`uploads/${file.filename}`, {
      type: "binary",
      cellDates: true,
      dateNF: "dd/mm/yyyy;@",
    });
    var sheet_name_list = workbook.SheetNames;
    const data = transformCSVData(sheet_name_list, workbook);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadExcelToGDrive = async (file) => {
  try {
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_CREDENTIALS,
      scopes: "https://www.googleapis.com/auth/drive",
    });
    const service = google.drive({ version: "v3", auth });

    const requestBody = {
      name: file.originalname,
      fields: "id",
    };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(path.join(__dirname, file.path)),
    };

    const response = await service.files.create({
      requestBody,
      media,
    });

    fs.unlinkSync(path.join(__dirname, file.path)); // Remove file from server after upload
    return response.data.id;
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err);
    throw err;
  }
};

router.post(
  "/save-invoices-bulk",
  upload.single("file"),
  specific.saveInvoicesBulk1
);
