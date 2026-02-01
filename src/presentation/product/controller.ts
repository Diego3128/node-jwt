import { CustomError } from "../../domain";
import { Response, Request } from "express";
import { CreateProductDTO, PaginationDTO } from "../../domain/dtos";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(public readonly productService: ProductService) {}

  handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  };

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDTO] = CreateProductDTO.createDTO(req.body);
    if (error) return res.status(400).json({ message: error });

    this.productService
      .createProduct(createProductDTO!)
      .then((product) => res.status(201).json({ product }))
      .catch((error) => this.handleError(error, res));
  };

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDTO] = PaginationDTO.create(+page, +limit);
    if (error) res.status(400).json({ message: error });

    this.productService
      .getProducts(paginationDTO!)
      .then((products) => res.status(200).json(products))
      .catch((error) => this.handleError(error, res));
  };

  getProductById = (req: Request, res: Response) => {
    res.json({ message: "get product by id" });
  };

  updateProduct = (req: Request, res: Response) => {
    res.json({ message: "update product" });
  };
  deleteProduct = (req: Request, res: Response) => {
    res.json({ message: "delete product" });
  };
}
