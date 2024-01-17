import Jobs from "../schemas/jobs.js";

class JobsController {
  async createJobs(req, res) {
    try {
      const jobs = await Jobs.create({...req.body,advertisedDate:Date.now()})
      res.json(jobs)
    } catch (e) {
      res.json(e)
    }
  }

  async getAllJobs(req, res) {
    try {
      const query = req.query;
      let filter = {};
      for (const key in query) {
        if (query[key]) {
          filter[key] = {$regex: new RegExp('.*' + query[key] + '.*', 'i')};

        }
      }
      const jobs = await Jobs.find(filter);
      return res.json(jobs);
    } catch (e) {
      res.json(e);
    }
  }
  async getJobOptions(req, res) {
    try {
      const jobs = await Jobs.find()
      return res.json(jobs)
    } catch (e) {
      res.json(e)
    }
  }
  async getOneJob(req, res) {
    try {
      const {id} = req.params
      if(!id){
        res.status(400).json({message:"ID is not found"})
      }
      const jobs=await Jobs.findById(id)
      return res.json(jobs)
    } catch (e){
      res.json(e)
    }

  }
  async deleteJob(req, res) {
    try {
      const {id} = req.params
      if(!id){
        res.status(400).json({message:"ID is not found"})
      }
      await Jobs.findByIdAndDelete(id)
      return res.json({message:"Job is deleted"})
    } catch (e){
      res.json(e)
    }

  }
}

export default new JobsController()