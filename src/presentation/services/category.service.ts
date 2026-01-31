import { CategoryModel } from "../../data/mongo";
import { CustomError, UserEntity } from "../../domain";
import { CreateCategoryDTO } from "../../domain/dtos";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";

type GetCategoriesResponse = {
  categories: CategoryEntity[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
};
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

  getCategories = async (
    paginationDTO: PaginationDTO,
  ): Promise<GetCategoriesResponse> => {
    try {
      const { page, limit } = paginationDTO;

      const [categories, totalCount] = await Promise.all([
        await CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .lean() // plain objects
          .exec(),

        await CategoryModel.countDocuments(),
      ]);

      const categoryEntities = categories.map((category) =>
        CategoryEntity.createFromObject(category),
      );

      const totalPages = Math.ceil(totalCount / limit);
      const baseURL = "/api/v1/category";
      return {
        categories: categoryEntities,
        currentPage: page,
        next: page < totalPages ? `${baseURL}?page=${page + 1}&limit=${limit}`: null,
        previous:
          page > 1 ? `${baseURL}?page=${page - 1}&limit=${limit}` : null,
        totalCount: totalCount,
        totalPages: totalPages,
      };
    } catch (error) {
      throw CustomError.internalServer("Internal server error");
    }
  };
}
