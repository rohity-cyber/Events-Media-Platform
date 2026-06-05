const express =
require("express");

const router =
express.Router();

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const authorize =
require(
  "../middleware/roleMiddleware"
);

const {

  getUsers,
  updateRole,
  deleteUser

} = require(
  "../controllers/adminController"
);

router.get(
  "/users",
  protect,
  authorize(
    "admin"
  ),
  getUsers
);

router.patch(
  "/users/:id/role",
  protect,
  authorize(
    "admin"
  ),
  updateRole
);

router.delete(
  "/users/:id",
  protect,
  authorize(
    "admin"
  ),
  deleteUser
);

module.exports =
router;