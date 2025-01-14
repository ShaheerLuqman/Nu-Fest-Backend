import express from "express";
import {
  //   addCategory,
  getCategories,
  getCategoryName,
} from "../controllers/categoryController.js";
const router = express.Router();
// router.post("/addcategory", addCategory);
router.get("/getcategories", getCategories);
router.get("/getcategoryname", getCategoryName);
// router.get("/getcategory/:id", getCategory);
// router.put("/updatecategory/:id", updateCategory);
// router.delete("/deletecategory/:id", deleteCategory);

export default router;
