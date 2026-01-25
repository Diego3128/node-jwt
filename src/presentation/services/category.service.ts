import { CategoryModel } from "../../data/mongo";
import { CustomError, UserEntity } from "../../domain";
import { CreateCategoryDTO } from "../../domain/dtos";
import { CategoryEntity } from "../../domain/entities/category.entity";

export class CategoryService {
  createCategory = async (
    createCategoryDTO: CreateCategoryDTO,
    userEntity: UserEntity,
  ) => {
    const exists = await CategoryModel.findOne({
      name: createCategoryDTO.name,
    });
    if (exists) throw CustomError.badRequest("Category already exists");

    try {
      const category = new CategoryModel({
        name: createCategoryDTO.name,
        available: createCategoryDTO.available,
        user: userEntity.id,
      });

      const result = await category.save();

      return {
        id: result.id,
        name: result.name,
        available: result.available,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Interval server error");
    }
  };

  getCategories = async (): Promise<CategoryEntity[]> => {
    try {
      const categories = await CategoryModel.find();

      const categoryEntities = categories.map((category) =>
        CategoryEntity.createFromObject(category),
      );
      return categoryEntities;
    } catch (error) {
      throw CustomError.internalServer("Internal server error");
    }
  };
}
