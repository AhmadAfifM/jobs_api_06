const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  const findJobs = await Job.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );

  res.status(StatusCodes.OK).json({
    msg: "Get all jobs successfully!",
    findJobs,
    count: findJobs.length,
  });
};

const getJob = async (req, res) => {
  // destructuring from two req => req.user and req.params
  // const {user:{userId}, params:{id:idJob}} = req
  const {
    user: { userId },
    params: { idJob },
  } = req;

  const findOne = await Job.findOne({ _id: idJob, createdBy: userId });
  console.log(findOne);
  if (!findOne) {
    throw new NotFoundError(`user with id ${idJob} is not found!`);
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `this data with id ${idJob} successfully loaded!`, findOne });
};

const createJob = async (req, res) => {
  // Filling createdby using req.user.userId
  req.body.createdBy = req.user.userId;
  const createJob = await Job.create(req.body);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Job created successfully!", createJob });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { idJob },
    body: { company, position },
  } = req;
  // req.body.createdBy = req.user.userId;
  // const {company, position} = req.body

  // console.log(req.body);
  // console.log(company, position);

  if (!company || !position) {
    throw new BadRequestError(`please provide company and position name`);
  }

  /* WAY 2 RECOMENDED   */
  const updateJob = await Job.findByIdAndUpdate({
    _id: idJob,
    createdBy: userId},
    req.body,
    {new: true, runValidators: true}
  );
  console.log("INI UPDATEJOB => ", updateJob)
  if (!updateJob) {
    console.log("MASUK KONDISI UPDATE");
    throw new NotFoundError(`job with id ${idJob} is not found!`);
  }
  console.log("BERHASIL UPDATE");

  res
    .status(StatusCodes.OK)
    .json({ msg: `job with id ${idJob} successfully updated!`, updateJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { idJob },
  } = req;
  console.log("Ini ID JOB => ", idJob, userId);

  const findOne = await Job.findOne({ _id: idJob, createdBy: userId });

  console.log("Ini findOne => ", findOne);
  if (findOne === null) {
    console.log("masuk kondisi");
    throw new NotFoundError(`user with ${idJob} is not found!`);
  }

  console.log("masuk lanjut");
  const deleteJob = await Job.findOneAndDelete({
    _id: idJob,
    createdBy: userId,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: `Job with id ${idJob} deleted successfully!`, deleteJob });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
