import * as adminService from "../../services/admin/adminService.js";
import asyncHandler from "express-async-handler";

const getOwners = asyncHandler(async (req, res) => {
  const {
    name,
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

export { getOwners };
