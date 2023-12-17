import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addImage(userDto: UpdateUserDto, dbPath: string): Promise<string> {
    const decodedImage: Buffer = Buffer.from(userDto.image, 'base64');
    const serverPath: string = path.join(
      __dirname,
      `/../../public/images/users/${dbPath}`,
    );
    fs.writeFile(serverPath, decodedImage, {}, (error) => {
      if (error) console.log(error);
      else console.log('File saved');
    });
    return dbPath;
  }

  async removeImage(dbPath: string) {
    const serverPath: string = path.join(
      __dirname,
      `/../../public/images/users/${dbPath}`,
    );

    fs.unlink(serverPath, (error) => {
      if (error) console.log(error);
      else console.log('File deleted');
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.image)
      createUserDto.image = await this.addImage(
        createUserDto,
        `${uuid()}.webp`,
      );
    const newUser: User = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async getUser(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUserByEmailAndPassword(email: string, password: string) {
    return this.usersRepository.findOneBy({ email, password });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.image)
      updateUserDto.image = await this.addImage(
        updateUserDto,
        (await this.getUser(id)).image,
      );
    await this.usersRepository.update({ id }, updateUserDto);
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<User> {
    const deletedUser: User = await this.getUser(id);
    await this.usersRepository.remove(deletedUser);
    this.removeImage(deletedUser.image);
    return deletedUser;
  }

  async generatePDF(email: string) {
    try {
      const { firstName, lastName, image } =
        await this.usersRepository.findOneBy({ email });

      let pdfDoc: PDFKit.PDFDocument = new PDFDocument();

      if (image)
        pdfDoc = pdfDoc.image(
          path.join(__dirname, `/../../public/images/users/${image}`),
          pdfDoc.page.width / 2 - 160 / 2,
          pdfDoc.y,
          {
            width: 160,
          },
        );

      pdfDoc
        .font('Helvetica')
        .fontSize(24)
        .text(`${firstName} ${lastName}`, pdfDoc.x, pdfDoc.y + 32, {
          align: 'center',
        })
        .end();

      let buffers: Buffer[] = [];
      pdfDoc.on('data', buffers.push.bind(buffers));
      pdfDoc.on('end', async () => {
        let pdfData: Buffer = Buffer.concat(buffers);
        await this.usersRepository.update({ email }, { pdf: pdfData });
      });

      return { isPdfCreated: true };
    } catch {
      return { isPdfCreated: false };
    }
  }
}
