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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async findPublic() {
        try {
            const categories = await this.categoriesService.findActive();
            return {
                success: true,
                data: categories
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch categories',
                error: error.message
            };
        }
    }
    async findAll() {
        try {
            const categories = await this.categoriesService.findAll();
            return {
                success: true,
                data: categories
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch categories',
                error: error.message
            };
        }
    }
    async findOne(id) {
        try {
            const category = await this.categoriesService.findOne(+id);
            return {
                success: true,
                data: category
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch category',
                error: error.message
            };
        }
    }
    async create(createCategoryDto) {
        try {
            const category = await this.categoriesService.create(createCategoryDto);
            return {
                success: true,
                message: 'Category created successfully',
                data: category
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create category',
                error: error.message
            };
        }
    }
    async update(id, updateCategoryDto) {
        try {
            const category = await this.categoriesService.update(+id, updateCategoryDto);
            return {
                success: true,
                message: 'Category updated successfully',
                data: category
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update category',
                error: error.message
            };
        }
    }
    async remove(id) {
        try {
            await this.categoriesService.remove(+id);
            return {
                success: true,
                message: 'Category deleted successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete category',
                error: error.message
            };
        }
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map