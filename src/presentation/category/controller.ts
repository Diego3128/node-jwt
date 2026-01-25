import { CustomError, UserEntity } from "../../domain";
import { Response, Request } from "express";
import { CreateCategoryDTO } from "../../domain/dtos";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(public readonly categoryService: CategoryService) {}

  handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  };

  getCategories = (req: Request, res: Response) => {
    // const userEntity: UserEntity = req.body.user;
    this.categoryService
      .getCategories()
      .then((categories) => {
        return res.status(200).json({ categories });
      })
      .catch((error) => this.handleError(error, res));
  };

  getCategoryById = (req: Request, res: Response) => {
    res.json({ message: "get category by id" });
  };

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryrDTO] = CreateCategoryDTO.createObject(
      req.body,
    );
    if (error) res.status(400).json({ message: error });

    this.categoryService
      .createCategory(createCategoryrDTO!, req.body.user)
      .then((category) =>
        res.status(201).json({ message: "category created", category }),
      )
      .catch((error) => this.handleError(error, res));
  };

  updateCategory = (req: Request, res: Response) => {
    res.json({ message: "update category" });
  };
  deleteCategory = (req: Request, res: Response) => {
    res.json({ message: "delete category" });
  };
}
