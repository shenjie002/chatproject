import { BookService } from './book.service';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    list(): Promise<{
        id: number;
        name: string;
        author: string;
        description: string;
        userId: number;
    }[]>;
    findById(id: string): Promise<{
        id: number;
        name: string;
        author: string;
        description: string;
        userId: number;
    }>;
    create(createBookDto: CreateBookDto): Promise<{
        id: number;
        name: string;
        author: string;
        description: string;
        userId: number;
    }>;
    update(updateBookDto: UpdateBookDto): Promise<void>;
    delete(id: string): Promise<{
        id: number;
        name: string;
        author: string;
        description: string;
        userId: number;
    }>;
}
