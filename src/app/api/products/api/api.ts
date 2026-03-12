export * from './product.service';
import { ProductService } from './product.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [ProductService, UserControllerService];
