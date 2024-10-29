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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let BookService = class BookService {
    async list() {
        const books = await this.prisma.book.findMany();
        return books;
    }
    async findById(id) {
        const book = await this.prisma.book.findUnique({
            where: {
                id: id,
            },
        });
        return book;
    }
    async create(createBookDto) {
        console.log('createBookDto', createBookDto);
        const bookList = await this.list();
        console.log('bookList', bookList);
        const hasbook = bookList.filter((i) => i.name === createBookDto.name);
        console.log('hasbook', hasbook);
        if (hasbook.length > 0) {
            throw new common_1.BadRequestException('该书名已存在');
        }
        const book = this.prisma.book.create({
            data: {
                name: createBookDto.name,
                author: createBookDto.author,
                description: createBookDto.description,
                user: {
                    connect: {
                        id: createBookDto.userId,
                    },
                },
            },
        });
        return book;
    }
    async update(updateBookDto) {
        this.prisma.book.update({
            where: {
                name: updateBookDto.name,
            },
            data: { ...updateBookDto },
        });
    }
    async delete(id) {
        const bookList = await this.list();
        const hasbook = bookList.filter((i) => i.id == id);
        if (!hasbook) {
            throw new common_1.BadRequestException('未知书名不存在');
        }
        const deleteResult = this.prisma.book.delete({
            where: { id: id },
        });
        return deleteResult;
    }
};
exports.BookService = BookService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], BookService.prototype, "prisma", void 0);
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)()
], BookService);
//# sourceMappingURL=book.service.js.map