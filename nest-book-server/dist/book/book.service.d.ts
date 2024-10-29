import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
export declare class BookService {
    private prisma;
    list(): Promise<{
        name: string;
        id: number;
        author: string;
        description: string;
        userId: number;
    }[]>;
    findById(id: number): Promise<{
        name: string;
        id: number;
        author: string;
        description: string;
        userId: number;
    }>;
    create(createBookDto: CreateBookDto): Promise<{
        name: string;
        id: number;
        author: string;
        description: string;
        userId: number;
    }>;
    update(updateBookDto: UpdateBookDto): Promise<void>;
    delete(id: number): Promise<{
        name: string;
        id: number;
        author: string;
        description: string;
        userId: number;
    }>;
}
