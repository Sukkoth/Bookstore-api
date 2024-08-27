import * as adminService from "../../services/admin/adminService.js";
import asyncHandler from "express-async-handler";
import ApproveOwnerSchema from "../../zodSchemas/ApproveOwnerSchema.js";
import ValidateBodyOnSchema from "../../utils/ValidateBodyOnSchema.js";
import { AppError } from "../../middleware/errorMiddleware.js";
import prismaService from "../../services/prismaService.js";

const getOwners = asyncHandler(async (req, res) => {
  if (req.user.permissions.cannot("read", "Owners")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to read this resource",
    });
  }
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
  if (req.user.permissions.cannot("manage", "Owners")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to perform this action",
    });
  }

  const { ownerId } = req.params;
  const deletedOwner = await adminService.deleteOwner(ownerId);
  return res.json({
    message: "owner deleted successfully",
    owner: deletedOwner,
  });
});

const approveOwner = asyncHandler(async (req, res) => {
  if (req.user.permissions.cannot("manage", "Owners")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to perform this action",
    });
  }
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
  if (req.user.permissions.cannot("read", "Transactions")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to read this resource",
    });
  }
  const { transactions, balance } = await adminService.getBalance();

  return res.json({
    wallet: {
      balance: balance || 0,
    },
    transactions,
  });
});

// THIS IS FOR TEST PURPOSE ONLY
const createPermissions = asyncHandler(async (req, res) => {
  const permissionsCount = await prismaService.permissions.count();
  if (permissionsCount > 0) {
    return res.json({
      message: "Perissions are already added",
    });
  }
  const permissions = await prismaService.permissions.createMany({
    data: [
      {
        action: "manage",
        subject: "all",
        roleId: 1,
      },
      {
        action: "manage",
        subject: "rentBooks",
        conditions: { authorId: "${user.id}" },
        roleId: 2,
      },
    ],
  });

  if (!permissions) {
    return res.status(500).json({
      message: "Permission not created",
    });
  }

  return res.status(201).json({
    message: "Create permissions",
    permissions,
  });
});

export { getOwners, deleteOwner, approveOwner, getBalance, createPermissions };
