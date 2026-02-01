import { ProductModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CreateProductDTO, PaginationDTO } from "../../domain/dtos";

type GetProductsResponse = {
  // products: ProductEntity[];
  products: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
};

export class ProductService {
  createProduct = async (createProductDTO: CreateProductDTO) => {

    const exists = await ProductModel.exists({ name: createProductDTO.name });
    if (exists)  throw CustomError.badRequest("There is already a product with that name");
    
    try {
      const product = new ProductModel(createProductDTO);
      const result = await product.save();

      console.log({result});

      return {
        product: result,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Interval server error");
    }
  };
  //

    getProducts = async (
      paginationDTO: PaginationDTO,
    ): Promise<GetProductsResponse> => {
      try {
        const { page, limit } = paginationDTO;

        const [products, totalCount] = await Promise.all([

          await ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user')
            .populate('category'),

          await ProductModel.countDocuments(),
        ]);

        // const productEntities = productEntities.map((product) =>
        //   ProductEntity.createFromObject(product),
        // );

        const totalPages = Math.ceil(totalCount / limit);
        const baseURL = "/api/v1/product";
        return {
          products: products,
          currentPage: page,
          next:
            page < totalPages
              ? `${baseURL}?page=${page + 1}&limit=${limit}`
              : null,
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
