import * as adminService from "../../services/admin/adminService.js";
import asyncHandler from "express-async-handler";
import ApproveOwnerSchema from "../../zodSchemas/ApproveOwnerSchema.js";
import ValidateBodyOnSchema from "../../utils/ValidateBodyOnSchema.js";

const getOwners = asyncHandler(async (req, res) => {
  const {
    name,
    owner,
    upload,
    location,
    status,
    approved,

    //pagination
    page = 1,
    pageSize = 10,
    sortField = "id",
    sortOrder = "asc",
  } = req.query;

  const params = {
    name,
    owner,
    upload,
    location,
    status,
    approved,

    //pagination
    page,
    pageSize,
    sortField,
    sortOrder,
  };

  const { data, pagination } = await adminService.getOwners(params);
  res.json({
    code: 200,
    count: data.length,
    pagination,
    owners: data,
  });
});

const deleteOwner = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const deletedOwner = await adminService.deleteOwner(ownerId);
  return res.json({
    message: "owner deleted successfully",
    owner: deletedOwner,
  });
});

const approveOwner = asyncHandler(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, ApproveOwnerSchema);
  const approveOwner = await adminService.approveOwner(
    req.params.ownerId,
    data
  );

  return res.json({
    code: 200,
    message: "Owner approved successfully",
    owner: approveOwner,
  });
});

const getBalance = asyncHandler(async (req, res) => {
  const { transactions, balance } = await adminService.getBalance();

  return res.json({
    wallet: {
      balance,
    },
    transactions,
  });
});

export { getOwners, deleteOwner, approveOwner, getBalance };
