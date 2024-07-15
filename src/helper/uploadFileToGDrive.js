// Google Drive Upload
export const uploadFileToGDrive = async (file) => {
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

    fs.unlinkSync(path.join(__dirname, file.path));
    return response.data.id;
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err);
    throw err;
  }
};
