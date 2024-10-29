import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { book } from '@prisma/client';

@Injectable()
export class BookService {
  @Inject(PrismaService)
  private prisma: PrismaService;
  async list() {
    const books: book[] = await this.prisma.book.findMany();
    return books;
  }

  async findById(id: number) {
    const book: book = await this.prisma.book.findUnique({
      where: {
        id: id,
      },
    });
    return book;
  }

  async create(createBookDto: CreateBookDto) {
    console.log('createBookDto', createBookDto);
    const bookList = await this.list();
    console.log('bookList', bookList);
    const hasbook = bookList.filter((i) => i.name === createBookDto.name);
    console.log('hasbook', hasbook);
    if (hasbook.length > 0) {
      throw new BadRequestException('该书名已存在');
    }
    const book = this.prisma.book.create({
      data: {
        name: createBookDto.name,
        author: createBookDto.author,
        description: createBookDto.description,
        // cover: createBookDto.cover,
        // 假设createBookDto.user包含userId
        user: {
          connect: {
            id: createBookDto.userId, // 或者使用其他唯一标识符，如email
          },
        },
      },
    });
    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    this.prisma.book.update({
      where: {
        name: updateBookDto.name,
      },
      data: { ...updateBookDto },
    });
  }

  async delete(id: number) {
    const bookList = await this.list();
    const hasbook = bookList.filter((i) => i.id == id);
    if (!hasbook) {
      throw new BadRequestException('未知书名不存在');
    }
    const deleteResult = this.prisma.book.delete({
      where: { id: id },
    });
    return deleteResult;
  }
}
