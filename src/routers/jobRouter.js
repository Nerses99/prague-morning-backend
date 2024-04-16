import { Router } from 'express';
import JobsController from '../controllers/JobsController.js';
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import Jobs from '../schemas/jobs.js';

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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const jobsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const newJobsData = jobsData.map((elem) => {
      const { ceoCompany, companySize, companyWebsite, founded, ...code } =
        elem;
      const companyDetails = {
        ceoCompany,
        companySize,
        companyWebsite,
        founded,
      };
      return { ...code, companyDetails };
    });

    const result = await Jobs.insertMany(newJobsData);

    res.json({ message: 'Jobs data uploaded successfully', result });
  } catch (error) {
    console.error('Error uploading jobs data:', error);
    res.status(500).json({ message: error.message });
  }
});

export default jobRouter;
