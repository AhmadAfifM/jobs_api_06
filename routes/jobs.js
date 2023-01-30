const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:idJob").patch(updateJob).delete(deleteJob).get(getJob);

module.exports = router;
