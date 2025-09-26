"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findPublic() {
        try {
            const products = await this.productsService.findActive();
            return {
                success: true,
                data: products
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch products',
                error: error.message
            };
        }
    }
    async findPublicOne(id) {
        try {
            const product = await this.productsService.findActiveOne(+id);
            return {
                success: true,
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch product',
                error: error.message
            };
        }
    }
    async findAll() {
        try {
            const products = await this.productsService.findAll();
            return {
                success: true,
                data: products
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch products',
                error: error.message
            };
        }
    }
    async findOne(id) {
        try {
            const product = await this.productsService.findOne(+id);
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }
            return {
                success: true,
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch product',
                error: error.message
            };
        }
    }
    async create(createProductDto) {
        try {
            const product = await this.productsService.create(createProductDto);
            return {
                success: true,
                message: 'Product created successfully',
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create product',
                error: error.message
            };
        }
    }
    async update(id, updateProductDto) {
        try {
            const product = await this.productsService.update(+id, updateProductDto);
            return {
                success: true,
                message: 'Product updated successfully',
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update product',
                error: error.message
            };
        }
    }
    async replace(id, updateProductDto) {
        try {
            const product = await this.productsService.update(+id, updateProductDto);
            return {
                success: true,
                message: 'Product updated successfully',
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update product',
                error: error.message
            };
        }
    }
    async remove(id) {
        try {
            await this.productsService.remove(+id);
            return {
                success: true,
                message: 'Product deleted successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete product',
                error: error.message
            };
        }
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findPublicOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "replace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map