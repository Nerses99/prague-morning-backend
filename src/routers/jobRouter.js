import { Router } from 'express';
import JobsController from '../controllers/JobsController.js';
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'uploads_jobFiles/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const jobRouter = new Router();

jobRouter.post('/jobs', JobsController.createJobs);
jobRouter.get('/job-options', JobsController.getJobOptions);
jobRouter.get('/jobs', JobsController.getAllJobs);
jobRouter.get('/jobs/:id', JobsController.getOneJob);
jobRouter.delete('/jobs/:id', JobsController.deleteJob);

jobRouter.post('/upload', upload.single('upload'), async (req, res) => {
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const jobsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({ message: 'Jobs uploaded successfully', jobsData });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

export default jobRouter;
